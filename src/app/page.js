'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching todos...');
      const response = await fetch('/api/todos');
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Received data:', data);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      toast.error('Failed to fetch todos');
      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      setIsAdding(true);
      console.log('Adding new todo:', newTodo);
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo }),
      });
      console.log('Add todo response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      setNewTodo("");
      fetchTodos();
      toast.success('Todo added successfully');
    } catch (error) {
      console.error('Error adding todo:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      toast.error('Failed to add todo');
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      console.log('Toggling todo:', todo);
      const response = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: todo._id,
          text: todo.text,
          completed: !todo.completed,
        }),
      });
      console.log('Toggle todo response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      fetchTodos();
    } catch (error) {
      console.error('Error toggling todo:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      toast.error('Failed to update todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      console.log('Deleting todo with id:', id);
      const response = await fetch(`/api/todos?id=${id}`, {
        method: 'DELETE',
      });
      console.log('Delete todo response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      fetchTodos();
      toast.success('Todo deleted successfully');
    } catch (error) {
      console.error('Error deleting todo:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      toast.error('Failed to delete todo');
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditingText(todo.text);
  };

  const updateTodo = async (todo) => {
    if (!editingText.trim()) return;

    try {
      console.log('Updating todo:', { todo, newText: editingText });
      const response = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: todo._id,
          text: editingText,
          completed: todo.completed,
        }),
      });
      console.log('Update todo response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      setEditingId(null);
      setEditingText("");
      fetchTodos();
      toast.success('Todo updated successfully');
    } catch (error) {
      console.error('Error updating todo:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      toast.error('Failed to update todo');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Todo List</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addTodo} className="flex gap-2 mb-6">
              <Input
                type="text"
                placeholder="Add a new todo..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="flex-1"
                disabled={isAdding}
              />
              <Button type="submit" disabled={isAdding}>
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add'
                )}
              </Button>
            </form>

            <div className="space-y-2">
              {isLoading ? (
                <div className="text-center py-4">Loading todos...</div>
              ) : todos.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No todos yet. Add one above!</div>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo._id}
                    className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm"
                  >
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo)}
                    />
                    {editingId === todo._id ? (
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={() => updateTodo(todo)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(null);
                            setEditingText("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                          {todo.text}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEditing(todo)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteTodo(todo._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
