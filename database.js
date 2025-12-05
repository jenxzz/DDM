import * as SQLite from 'expo-sqlite';

let db = null;

export async function initDB() {
  try {
    db = await SQLite.openDatabaseAsync('livros.db');
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS livros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        autor TEXT NOT NULL,
        ano INTEGER
      );
    `);
    console.log('Banco de dados inicializado com sucesso');
  } catch (erro) {
    console.error('Erro ao inicializar DB:', erro);
  }
}

export async function adicionarLivro(titulo, autor, ano) {
  try {
    await db.runAsync(
      'INSERT INTO livros (titulo, autor, ano) VALUES (?, ?, ?);',
      [titulo, autor, ano]
    );
    console.log('Livro adicionado');
  } catch (erro) {
    console.error('Erro ao adicionar livro:', erro);
  }
}

export async function listarLivros() {
  try {
    const livros = await db.getAllAsync('SELECT * FROM livros;');
    return livros;
  } catch (erro) {
    console.error('Erro ao listar livros:', erro);
    return [];
  }
}

export async function deletarLivro(id) {
  try {
    await db.runAsync('DELETE FROM livros WHERE id = ?;', [id]);
    console.log('Livro deletado');
  } catch (erro) {
    console.error('Erro ao deletar livro:', erro);
  }
}
