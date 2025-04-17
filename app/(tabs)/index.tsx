import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
} from "react-native";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5, Foundation } from "@expo/vector-icons";

const Index = () => {
  const [task, setTask] = useState("");
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  useEffect(() => {
    loadTask();
  }, []);

  useEffect(() => {
    saveTask();
  }, [list]);

  const loadTask = async () => {
    try {
      const saved = await AsyncStorage.getItem("tasks");
      if (saved !== null) {
        setList(JSON.parse(saved));
      }
    } catch (error) {
      console.log("Gagal memuat data:", error);
    }
  };

  const saveTask = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(list));
    } catch (error) {
      console.log("Gagal menyimpan data:", error);
    }
  };

  const addTask = () => {
    if (task.trim() === "") return;

    const newTask = {
      id: Date.now().toString(),
      title: task.trim(),
      completed: false,
    };

    setList([...list, newTask]);
    setTask("");
  };

  const handleDelete = (id) => {
    const filtered = list.filter((item) => item.id !== id);
    setList(filtered);
  };

  const startEdit = (item) => {
    setTask(item.title);
    setIsEditing(true);
    setEditId(item.id);
  };

  const handleEdit = () => {
    const updated = list.map((item) =>
      item.id === editId ? { ...item, title: task.trim() } : item
    );
    setList(updated);
    setTask("");
    setIsEditing(false);
    setEditId("");
  };

  const completeTask = async (id) => {
    try {
      const updatedTasks = list.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      setList(updatedTasks);
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } catch (error) {
      console.log("Gagal memperbarui status tugas:", error);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <ScrollView>
        <View style={tw`mx-5 mt-10`}>
          <Text style={tw`font-bold text-2xl text-left mb-6`}>CTTN</Text>

          {/* Input tugas */}
          <View style={tw`flex-row items-center gap-2 mb-4`}>
            <TextInput
              placeholder="Tugas nya apa?"
              value={task}
              onChangeText={setTask}
              style={tw`flex-1 border border-gray-400 rounded-lg px-4 py-2 bg-white text-black`}
            />
            <TouchableOpacity
              style={tw`bg-blue-500 px-4 py-2 rounded-lg`}
              onPress={isEditing ? handleEdit : addTask}>
              <Text style={tw`text-white text-sm`}>
                {isEditing ? "Edit" : "Tambah"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={tw`font-bold text-gray-500 text-sm text-left mb-6`}>
            To do
          </Text>

          {/* Daftar tugas */}
          <FlatList
            data={list}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={tw`flex-row items-center bg-white rounded-lg p-3 mb-2 shadow-sm justify-between`}>
                {/* Checkbox */}
                <TouchableOpacity onPress={() => completeTask(item.id)}>
                  <View
                    style={tw`w-5 h-5 border-2 ${
                      item.completed ? "bg-green-500" : "bg-white"
                    } border-gray-400 rounded-full justify-center items-center`}>
                    {item.completed && (
                      <View style={tw`w-2.5 h-2.5 bg-white rounded-full`} />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Judul tugas */}
                <View style={tw`flex-1 ml-2`}>
                  <Text
                    style={tw`text-base ${
                      item.completed
                        ? "text-gray-400 line-through"
                        : "text-black"
                    }`}>
                    {item.title}
                  </Text>
                </View>

                {/* Tombol edit */}
                <TouchableOpacity
                  onPress={() => startEdit(item)}
                  style={tw`bg-yellow-500 px-3 py-1 rounded-lg mr-2`}>
                  <Foundation name="pencil" size={16} color="#fff" />
                </TouchableOpacity>

                {/* Tombol hapus */}
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={tw`bg-red-500 px-3 py-1 rounded-lg`}>
                  <FontAwesome5 name="trash" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
