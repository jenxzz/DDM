import Estilos from './styles/Estilos.js';
import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import { initDB, adicionarLivro, listarLivros, deletarLivro } from './database';
import LivroItem from './components/LivroItem';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [livros, setLivros] = useState([]);

  async function carregarLivros() {
    const lista = await listarLivros();
    setLivros(lista);
  };
  
  const prepararApp = async () => {
    await initDB();
    await carregarLivros();
  };

  async function handleAdicionar() {
    if (!titulo.trim() || !autor.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    await adicionarLivro(titulo, autor, new Date().getFullYear());
    setTitulo('');
    setAutor('');
    await carregarLivros();
  };

  async function handleDeletar(id) {
    await deletarLivro(id);
    await carregarLivros();
  };

  useEffect(() => {
    prepararApp();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={Estilos.safeAreaViewContainer}>
        <Text style={Estilos.textoTitulo}>
          Minha Biblioteca (SQLite)
        </Text>

        <View style={Estilos.camposCadastroContainer}>
          <TextInput
            placeholder="Título do Livro"
            value={titulo}
            onChangeText={setTitulo}
            style={Estilos.campoTexto}
          />
          <TextInput
            placeholder="Autor"
            value={autor}
            onChangeText={setAutor}
            style={Estilos.campoTexto}
          />
          <Button title="Adicionar Livro" onPress={handleAdicionar} />
        </View>

        <FlatList
          data={livros}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <LivroItem id={item.id} titulo={item.titulo} autor={item.autor} ano={item.ano} onDelete={handleDeletar} />
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
