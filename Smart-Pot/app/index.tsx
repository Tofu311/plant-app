import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Index() {
  const [selectedPlant, setSelectedPlant] = useState("Monstera");
  const [waterLevel, setWaterLevel] = useState(78); // percentage
  const [soilMoisture, setSoilMoisture] = useState(42); // percentage
  const [lightIntensity, setLightIntensity] = useState(65); // percentage
  const [temperature, setTemperature] = useState(23.5); // celsius
  const [humidity, setHumidity] = useState(60); // percentage
  const [lightMode, setLightMode] = useState("Auto"); // Auto, On, Off
  const [isWatering, setIsWatering] = useState(false);

  // Plant options
  const plants = ["Mint", "Snake Plant", "Pothos", "Fiddle Leaf Fig", "Peace Lily"];

  // Toggle light mode
  const toggleLightMode = () => {
    const modes = ["Auto", "On", "Off"];
    const currentIndex = modes.indexOf(lightMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setLightMode(modes[nextIndex]);
  };

  const activateWaterPump = async () => {
    const nextState = !isWatering;
  
    try {
      const { error } = await supabase
        .from('sensor_data')
        .update({ is_button_pump: nextState })
        .eq('id', 1);
  
      if (error) {
        console.error('Failed to update pump state:', error.message);
      } else {
        console.log(`Pump ${nextState ? 'activated' : 'deactivated'} successfully`);
        setIsWatering(nextState);
        
        // Update soil moisture slider (not pulling from sensor data)
        if (nextState) {
          setSoilMoisture((prev) => Math.min(prev + 10, 100));
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  // Simulate light intensity change
  const adjustLightIntensity = (value) => {
    // This would normally connect to the actual hardware
    setLightIntensity(value);
  };

  // Render custom slider component
  const Slider = ({ value, onValueChange, disabled }) => {
    const [sliderValue, setSliderValue] = useState(value);
    
    const handlePress = (event) => {
      if (disabled) return;
      
      // Get position relative to the slider
      const { locationX } = event.nativeEvent;
      const sliderWidth = 300; // This should match the width in styles
      const newValue = Math.max(0, Math.min(100, Math.round((locationX / sliderWidth) * 100)));
      
      setSliderValue(newValue);
      onValueChange(newValue);
    };

    return (
      <View style={styles.sliderContainer}>
        <View 
          style={[styles.sliderTrack, disabled && styles.sliderDisabled]}
          onTouchStart={handlePress}
          onTouchMove={handlePress}
        >
          <View 
            style={[
              styles.sliderFill, 
              { width: `${sliderValue}%` },
              disabled && styles.sliderFillDisabled
            ]} 
          />
          <View 
            style={[
              styles.sliderThumb, 
              { left: `${sliderValue}%` },
              disabled && styles.sliderThumbDisabled
            ]} 
          />
        </View>
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>0%</Text>
          <Text style={styles.sliderValue}>{sliderValue}%</Text>
          <Text style={styles.sliderLabel}>100%</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Plant Buddy</Text>
        <Text style={styles.subTitle}>Smart Plant Controller</Text>
      </View>

      {/* Plant selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selected Plant</Text>
        <View style={styles.plantSelector}>
          {plants.map((plant) => (
            <TouchableOpacity
              key={plant}
              style={[
                styles.plantOption,
                selectedPlant === plant && styles.selectedPlantOption,
              ]}
              onPress={() => setSelectedPlant(plant)}
            >
              <Text
                style={[
                  styles.plantText,
                  selectedPlant === plant && styles.selectedPlantText,
                ]}
              >
                {plant}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Status cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Water Level</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${waterLevel}%`, backgroundColor: "#2196F3" }]}
            />
          </View>
          <Text style={styles.statValue}>{waterLevel}%</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Soil Moisture</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${soilMoisture}%`, backgroundColor: "#8D6E63" }]}
            />
          </View>
          <Text style={styles.statValue}>{soilMoisture}%</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Light Intensity</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${lightIntensity}%`, backgroundColor: "#FFC107" }]}
            />
          </View>
          <Text style={styles.statValue}>{lightIntensity}%</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Temperature</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar, 
                { 
                  width: `${(temperature / 40) * 100}%`, 
                  backgroundColor: "#F44336"
                }
              ]}
            />
          </View>
          <Text style={styles.statValue}>{temperature}°C</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Humidity</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${humidity}%`, backgroundColor: "#26A69A" }]}
            />
          </View>
          <Text style={styles.statValue}>{humidity}%</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsSection}>
        <Text style={styles.sectionTitle}>Controls</Text>
        
        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={toggleLightMode}
          >
            <View style={[styles.lightIndicator, 
              { backgroundColor: lightMode === "On" ? "#FFC107" : "#E0E0E0" }]} 
            />
            <Text style={styles.controlButtonText}>Light: {lightMode}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={activateWaterPump}
          >
            <Text style={styles.controlButtonText}>
              {isWatering ? "Stop Watering": "Water Now"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Light intensity slider (visible when not in Auto mode) */}
        {lightMode !== "Auto" && (
          <View style={styles.sliderSection}>
            <Text style={styles.sliderTitle}>Adjust Light Intensity</Text>
            <Slider 
              value={lightIntensity} 
              onValueChange={adjustLightIntensity} 
              disabled={lightMode === "Off"}
            />
          </View>
        )}
      </View>

      {/* Plant care tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Care Tips for {selectedPlant}</Text>
        <Text style={styles.tipText}>
          • Water once a week, allow soil to dry between waterings{"\n"}
          • Prefers bright, indirect light{"\n"}
          • Keep humidity above 50% for optimal growth
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#4CAF50",
    padding: 20,
    paddingTop: 50,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  subTitle: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4CAF50",
  },
  plantSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  plantOption: {
    backgroundColor: "#E8F5E9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: "#E8F5E9",
  },
  selectedPlantOption: {
    backgroundColor: "#4CAF50",
    borderColor: "#2E7D32",
  },
  plantText: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  selectedPlantText: {
    color: "white",
  },
  statsContainer: {
    padding: 15,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
  },
  controlsSection: {
    padding: 15,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  controlButton: {
    backgroundColor: "#8D6E63",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  controlButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  lightIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  tipsContainer: {
    backgroundColor: "#E8F5E9",
    margin: 15,
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2E7D32",
  },
  tipText: {
    color: "#333",
    lineHeight: 20,
  },
  sliderSection: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sliderTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 15,
    color: "#333",
  },
  sliderContainer: {
    width: "100%",
    height: 60,
    justifyContent: "center",
  },
  sliderTrack: {
    width: 300,
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    alignSelf: "center",
  },
  sliderDisabled: {
    opacity: 0.5,
  },
  sliderFill: {
    height: "100%",
    backgroundColor: "#FFC107",
    borderRadius: 5,
  },
  sliderFillDisabled: {
    backgroundColor: "#BDBDBD",
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
    position: "absolute",
    top: -5,
    marginLeft: -10,
    borderWidth: 2,
    borderColor: "#FFC107",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  sliderThumbDisabled: {
    borderColor: "#BDBDBD",
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
    alignSelf: "center",
    marginTop: 10,
  },
  sliderLabel: {
    color: "#666",
    fontSize: 12,
  },
  sliderValue: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 14,
  },
});