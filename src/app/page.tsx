'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { api } from "@/utils/api";
import { Header } from './_components/header';

interface Todo {
  id: string;
  title: string;
  details: string;
  done: boolean;
}

function Home() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  const ctx = api.useUtils();

  const { data, isLoading: todosLoading } = 
      api.todo.getTodosByUser.useQuery(session?.user?.id ?? "");

  const { mutate } = api.todo.createTodo.useMutation({
    onSuccess: () => {
      setTitle("");
      setDetails("");
      void ctx.todo.getTodosByUser.invalidate()
    }
  });

  const { mutate: setDoneMutate } = api.todo.setDone.useMutation({
    onSuccess: () => {
      void ctx.todo.getTodosByUser.invalidate();
    }
  });

  const { mutate: deleteMutate } = api.todo.deleteTodo.useMutation({
    onSuccess: () => {
      void ctx.todo.getTodosByUser.invalidate();
    }
  });

  console.log("TODOS: ", data);
  
  return (
    <div className="flex grow flex-col">
      <Header />
      <div className="flex grow flex-col w-1/3">
        <input 
          className='m-2 border border-blue-300'
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea 
          className='m-2 border border-blue-300'
          placeholder="Enter Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <button
          className='w-48 border m-2 bg-blue-300 rounded p-2'
          onClick={() => mutate({ 
            userId: session?.user.id ?? "", 
            title: title, 
            details: details, 
            done: false 
          })}
        >
          Add Todo
        </button>
      </div>
      <div className='grid grid-cols-3 gap-4 m-2'>
        {data?.map((todo:Todo) => (
          <div className={`text-white border rounded p-2 shadow-md ${todo.done ? "bg-green-500" : "bg-red-500"}`}>
            <input
              type="checkbox" 
              onChange={() => setDoneMutate({
                id: todo.id,
                done: !todo.done
              })}
            />
            <p className='font-bold'>{todo.title}</p>
            <p>{todo.details}</p>
            <p className='font-semibold'>{todo.done? "Completed" : "Incomplete"}</p>
            <button
              onClick={() => deleteMutate(todo.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <SessionProvider>
      <Home />
    </SessionProvider>
  );
}
