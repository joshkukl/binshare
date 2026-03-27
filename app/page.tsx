import React from "react";
/*import Image from "next/image";*/
import Intro from "@/components/intro";
import Section from "@/components/section";
import AccordionUI from "@/layout/ui/accordion";
import User from "@/components/user";
import Link from "next/link";

// 1. Change the fetch function to grab 'users' instead of 'todos'
async function getUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await response.json();
  return data;
}

const Home: React.FC = async() => {
  // 2. Call the new function
  const users = await getUsers();
  
  console.log(users, "users");

  return (
    <main className="flex w-full flex-col items-center justify-between py-16 px-16 bg-white dark:bg-black sm:items-start">
      <Section><Intro /></Section>
      <Section><AccordionUI /></Section>
      <Section>
       <User userName="Student Name" userType="Admin" />

       {/* 3. Map through the new Users data and point the Link to your new dynamic route */}
       <ul className="list-disc pl-5 my-3">
        {users.map((user: { id: number; name: string }) => (
          <li key={user.id} className="mb-2">
            <Link className="text-400 hover:underline" href={`/users/${user.id}`}>
              {user.name}
            </Link>
          </li>
        ))}
       </ul>
      </Section>
    </main>
  );
}

export default Home;