import Navbar from "@/components/navbar";

export default function Home(){
    return(
        <div className="flex flex-col justify-between w-screen h-screen bg-linear-to-b from-[#e92727] to-black">
            <Navbar/>
        </div>
    );
}