import { signIn, signOut, useSession } from "next-auth/react";

export const Header = () => {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between px-2 py-4">
      <div className="text-orange-500 text-xl">TODO APP</div>
      <div>
        { session?.user ? (
          <div className="flex flex-row gap-2">
            <p>{ session.user.name }</p>
            <button onClick={() => void signOut()}>Sign Out</button>
          </div>
        ) : (
          <button 
            className="bg-blue-500 p-2 rounded"
            onClick={() => void signIn()}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};
