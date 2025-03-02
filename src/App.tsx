import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import AnimationProvider from "./components/AnimationProvider";

const AdminPanel = lazy(() => import("./components/AdminPanel"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AnimationProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/*" element={<AdminPanel />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </AnimationProvider>
    </Suspense>
  );
}


export default App;


import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

function Page() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    function getTodos() {
      const { data: todos } = await supabase.from('todos').select()

      if (todos.length > 1) {
        setTodos(todos)
      }
    }

    getTodos()
  }, [])

  return (
    <div>
      {todos.map((todo) => (
        <li key={todo}>{todo}</li>
      ))}
    </div>
  )
}
export default Page
