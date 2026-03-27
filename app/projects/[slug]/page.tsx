// app/projects/[slug]page.tsx (dynamic project page & server component)

// Define the types for the parameters
type TodoSampleProps = {
  params: {
    slug: number;
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  };
};

const ProjectPage: React.FC<TodoSampleProps> = async ({
  params,
}: TodoSampleProps) => {
  
  const { slug } = await params; // Extract the id from the params by destructuring
  console.log('Params: ', params);
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${slug}`,
  );
  const data = await response.json();

  console.log('Project Data: ', data);
  return (
    <div className="flex flex-1 w-full justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* 1. Main still centers everything, but we removed gap-4 from here */}
      <main className="flex flex-1 w-full flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        
        {/* 2. Added a wrapper div to hold the text together as one block */}
        {/* The text inside here will naturally align to the left */}
        <div className="flex flex-col gap-4">
          <h1>Project: {data.title ? data.title : "No Title Available"}</h1>
          <p>Completed: {data.completed ? "Yes" : "No"}</p>
          <p>User ID: {data.userId ? String(data.userId) : "Unknown"}</p>
        </div>
      
      </main>
    </div>
  );
};

export default ProjectPage;
