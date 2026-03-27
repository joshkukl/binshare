// app/users/[id]/page.tsx

// 1. Define the types. In Next.js, 'params' only contains the folder name variable ([id]).
type UserPageProps = {
  params: {
    id: string;
  };
};

const UserProfilePage: React.FC<UserPageProps> = async ({
  params,
}: UserPageProps) => {
  
  // Extract the id from the params, matching the professor's syntax
  const { id } = await params; 
  console.log('Params: ', params);

  // Fetch from the /users endpoint instead of /todos
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  
  // Parse the JSON data
  const data = await response.json();
  console.log('User Data: ', data);

  return (
    <div className="flex flex-1 w-full justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        
        {/* Wrapper div using the professor's exact spacing */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">
            User Profile: {data.name ? data.name : "No Name Available"}
          </h1>
          <p className="text-gray-500">@{data.username}</p>
          
          <div className="mt-4 border-t pt-4 border-gray-200 dark:border-gray-800">
            <p><strong>Email:</strong> {data.email ? data.email : "Unknown"}</p>
            <p><strong>Phone:</strong> {data.phone ? data.phone : "Unknown"}</p>
            <p><strong>Website:</strong> {data.website ? data.website : "Unknown"}</p>
            
            {/* We check if company exists before trying to render its name to prevent crashes */}
            {data.company && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <strong>Works at:</strong> {data.company.name}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;