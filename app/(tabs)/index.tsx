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
import { Picker } from "@react-native-picker/picker";

const Index = () => {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("PR");
  const [deadline, setDeadline] = useState("");
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
    if (task.trim() === "" || deadline.trim() === "") return;

    const newTask = {
      id: Date.now().toString(),
      title: task.trim(),
      category: category,
      deadline: deadline,
      completed: false,
    };

    setList([...list, newTask]);
    setTask("");
    setCategory("PR");
    setDeadline("");
  };

  const handleDelete = (id) => {
    const filtered = list.filter((item) => item.id !== id);
    setList(filtered);
  };

  const handleEdit = () => {
    const updated = list.map((item) =>
      item.id === editId
        ? { ...item, title: task.trim(), category, deadline }
        : item
    );
    setList(updated);
    setTask("");
    setCategory("PR");
    setDeadline("");
    setIsEditing(false);
    setEditId("");
  };

  const startEdit = (item) => {
    setTask(item.title);
    setCategory(item.category);
    setDeadline(item.deadline);
    setIsEditing(true);
    setEditId(item.id);
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
          <Text style={tw`font-bold text-2xl text-left mb-6`}>Wahahaha</Text>

          <View style={tw`flex-row items-center gap-2 mb-4`}>
            <TextInput
              placeholder="Tambahkan tugas"
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

          {/* Dropdown Kategori */}
          <View style={tw`border border-gray-400 rounded-lg bg-white mb-4`}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}>
              <Picker.Item label="PR" value="PR" />
              <Picker.Item label="Proyek" value="Proyek" />
              <Picker.Item label="Ujian" value="Ujian" />
            </Picker>
          </View>

          {/* Input Deadline */}
          <TextInput
            placeholder="Deadline (misal: 2025-04-20)"
            value={deadline}
            onChangeText={setDeadline}
            style={tw`border border-gray-400 rounded-lg px-4 py-2 bg-white text-black mb-4`}
          />

          <Text style={tw`font-bold text-gray-500 text-sm text-left mb-6`}>
            To do
          </Text>

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

                <View style={tw`flex-1 ml-2`}>
                  <Text
                    style={tw`text-base ${
                      item.completed
                        ? "text-gray-400 line-through"
                        : "text-black"
                    }`}>
                    {item.title}
                  </Text>
                  <Text style={tw`text-xs text-gray-500`}>
                    Kategori: {item.category}
                  </Text>
                  <Text style={tw`text-xs text-red-500`}>
                    Deadline: {item.deadline}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => startEdit(item)}
                  style={tw`bg-yellow-500 px-3 py-1 rounded-lg mr-2`}>
                  <Foundation name="pencil" size={16} color="#fff" />
                </TouchableOpacity>
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
