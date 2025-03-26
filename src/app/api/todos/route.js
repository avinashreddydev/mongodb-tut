import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Todo from '@/models/Todo';

export async function GET() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');
    
    console.log('Fetching todos from database...');
    const todos = await Todo.find({}).sort({ createdAt: -1 });
    console.log('Todos fetched successfully:', todos);
    
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error in GET /api/todos:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');
    
    const body = await request.json();
    console.log('Received todo data:', body);
    
    console.log('Creating new todo...');
    const todo = await Todo.create({
      text: body.text,
      completed: false,
    });
    console.log('Todo created successfully:', todo);
    
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/todos:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');
    
    const body = await request.json();
    console.log('Received update data:', body);
    
    console.log('Updating todo...');
    const todo = await Todo.findByIdAndUpdate(
      body._id,
      { 
        text: body.text,
        completed: body.completed,
      },
      { new: true, runValidators: true }
    );
    
    if (!todo) {
      console.error('Todo not found with id:', body._id);
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    
    console.log('Todo updated successfully:', todo);
    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error in PUT /api/todos:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log('Deleting todo with id:', id);
    
    const todo = await Todo.findByIdAndDelete(id);
    
    if (!todo) {
      console.error('Todo not found with id:', id);
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    
    console.log('Todo deleted successfully:', todo);
    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/todos:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 