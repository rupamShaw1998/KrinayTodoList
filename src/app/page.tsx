import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { api } from "~/utils/api";

export default function Home() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  const ctx = api.useContext();

  const { data, isLoading: todosLoading } = 
      api.todo.getTodosByUser.useQuery(session?.user?.id ?? "");

  const { mutate } = api.todo.createTodo.useMutation({
    onSuccess: () => {
      setTitle("");
      setDetails("");
      void ctx.todo.getTodosByUser.invalidate()
    }
  })
  
  return (
    <div className="flex grow flex-col">
      {data?.map((todo:any) => (
        <div>{ todo.title }</div>
      ))}
      <div>
        <input 
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea 
          placeholder="Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <button
          onClick={() => mutate({ 
            userId: session?.user.id ?? "", 
            title: title, 
            details: details, 
            done: false 
          })}
        >Add Todo</button>
      </div>
    </div>
  );
}
