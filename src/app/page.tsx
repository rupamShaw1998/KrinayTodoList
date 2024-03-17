import { api } from "~/utils/api";

export default function Home() {
  const { data, isLoading: todosLoading } = api.todo.getAll.useQuery();
  console.log("TODOS: ", data);
  
  return (
    <div className="flex grow flex-col">
      { data?.map((todo: any) => (
        <div>{ todo.title }</div>
      ))}
    </div>
  );
}