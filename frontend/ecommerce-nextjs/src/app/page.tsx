import Image from "next/image";
import Home from "./Home/page";

export default function MainPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Home/>
    </div>
  );
}
