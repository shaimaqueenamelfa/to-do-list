import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import tw from "twrnc";
import { FontAwesome5, Foundation } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

const Explore = () => {
  const [judul, setJudul] = useState("");
  const [mapel, setMapel] = useState("");
  const [deadline, setDeadline] = useState("");
  const [daftarTugas, setDaftarTugas] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [idEdit, setIdEdit] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const tambahTugas = () => {
    if (!judul.trim() || !deadline.trim()) return;

    const tugasBaru = {
      id: Date.now().toString(),
      title: judul.trim(),
      category: mapel,
      deadline: deadline,
      completed: false,
    };

    setDaftarTugas([...daftarTugas, tugasBaru]);
    resetForm();
  };

  const resetForm = () => {
    setJudul("");
    setMapel("");
    setDeadline("");
    setEditMode(false);
    setIdEdit("");
  };

  const editTugas = () => {
    const update = daftarTugas.map((t) =>
      t.id === idEdit
        ? { ...t, title: judul.trim(), category: mapel, deadline }
        : t
    );
    setDaftarTugas(update);
    resetForm();
  };

  const mulaiEdit = (tugas) => {
    setJudul(tugas.title);
    setMapel(tugas.category);
    setDeadline(tugas.deadline);
    setEditMode(true);
    setIdEdit(tugas.id);
  };

  const hapusTugas = (id) => {
    Alert.alert("Hapus", "Yakin mau hapus tugas ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () =>
          setDaftarTugas(daftarTugas.filter((item) => item.id !== id)),
      },
    ]);
  };

  const toggleSelesai = (id) => {
    const update = daftarTugas.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setDaftarTugas(update);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <ScrollView>
        <View style={tw`p-5 mt-10`}>
          <Text style={tw`text-2xl font-bold mb-5`}>Tugasku</Text>

          <TextInput
            placeholder="Tugas apa?"
            value={judul}
            onChangeText={setJudul}
            style={tw`border border-gray-400 rounded-lg px-4 py-2 bg-white mb-3`}
          />
          <TextInput
            placeholder="Mapel?"
            value={mapel}
            onChangeText={setMapel}
            style={tw`border border-gray-400 rounded-lg px-4 py-2 bg-white mb-3`}
          />

          {/* Input untuk Deadline */}
          <View style={tw`flex-row items-center mb-4`}>
            <TextInput
              placeholder="Pilih Deadline"
              value={deadline}
              onChangeText={setDeadline}
              style={tw`flex-1 border border-gray-400 rounded-lg px-4 py-2 bg-white`}
              editable={false} // Menghindari edit langsung, hanya tombol kalender yang digunakan
            />
            <TouchableOpacity
              onPress={() => setShowCalendar(!showCalendar)}
              style={tw`ml-2 bg-blue-500 p-2 rounded-lg`}>
              <FontAwesome5 name="calendar" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Kalender */}
          {showCalendar && (
            <Calendar
              onDayPress={(day) => {
                setDeadline(day.dateString);
                setShowCalendar(false); // Tutup kalender setelah memilih tanggal
              }}
              markedDates={{
                [deadline]: {
                  selected: true,
                  marked: true,
                  selectedColor: "blue",
                },
              }}
              theme={{
                selectedDayBackgroundColor: "#3b82f6",
                todayTextColor: "#3b82f6",
                arrowColor: "#3b82f6",
              }}
              style={tw`mb-4 rounded-lg shadow-sm`}
            />
          )}

          <TouchableOpacity
            style={tw`bg-blue-500 py-2 rounded-lg`}
            onPress={editMode ? editTugas : tambahTugas}>
            <Text style={tw`text-white text-center font-semibold`}>
              {editMode ? "Update" : "Tambah"}
            </Text>
          </TouchableOpacity>

          <Text style={tw`mt-6 mb-3 text-gray-600 font-semibold text-sm`}>
            Daftar Tugas
          </Text>

          {daftarTugas.length === 0 ? (
            <Text style={tw`text-center text-gray-400 mt-4`}>
              Tidak ada tugas
            </Text>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={daftarTugas}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={tw`bg-white flex-row items-center justify-between p-3 rounded-lg mb-3 shadow-sm`}>
                  <TouchableOpacity onPress={() => toggleSelesai(item.id)}>
                    <View
                      style={tw`w-5 h-5 rounded-full border-2 ${
                        item.completed ? "bg-green-500" : "bg-white"
                      } border-gray-400 justify-center items-center`}>
                      {item.completed && (
                        <View style={tw`w-2.5 h-2.5 bg-white rounded-full`} />
                      )}
                    </View>
                  </TouchableOpacity>

                  <View style={tw`flex-1 ml-3`}>
                    <Text
                      style={tw`${
                        item.completed
                          ? "line-through text-gray-400"
                          : "text-black"
                      }`}>
                      {item.title}
                    </Text>
                    <Text style={tw`text-xs text-gray-500`}>
                      Mapel: {item.category}
                    </Text>
                    <Text style={tw`text-xs text-red-500`}>
                      Deadline: {item.deadline}
                    </Text>
                  </View>

                  <View style={tw`flex-row gap-2`}>
                    <TouchableOpacity
                      onPress={() => mulaiEdit(item)}
                      style={tw`bg-yellow-500 px-2 py-1 rounded-lg`}>
                      <Foundation name="pencil" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => hapusTugas(item.id)}
                      style={tw`bg-red-500 px-2 py-1 rounded-lg`}>
                      <FontAwesome5 name="trash" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Explore;
