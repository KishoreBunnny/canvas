"use client"
import { useTool } from "@/context/ToolContext";
import { ALargeSmall, Circle, Diamond, Eraser, GitBranchIcon, Github, Grab, Images, Menu, Minus, Moon, MousePointer, MoveRight, Pencil, Square, Sun } from "lucide-react"
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";


type menuItemsType = {
    name: string;
    icon: ReactNode;
    tag?: string;
}[]

const menuItems: menuItemsType = [
    {
        name: "grab",
        icon: <Grab />,
        tag: "beta",
    },
    {
        name: "mouse",
        icon: <MousePointer />,
        tag: "beta",
    },
    {
        name: "rect",
        icon: <Square />
    },
    {
        name: "circle",
        icon: <Circle />
    }, {
        name: "diamond",
        icon: <Diamond />
    }, {
        name: "arrow",
        icon: <MoveRight />
    }, {
        name: "line",
        icon: <Minus />
    },
    {
        name: "pen",
        icon: <Pencil />
    }
    ,
    {
        name: "text",
        icon: <ALargeSmall />
    },
    {
        name: "images",
        icon: <Images />,
        tag: "beta",
    },
    {
        name: "eraser",
        icon: <Eraser />
    }
]


function SideMenu({ setOpenSideMenu }: any) {
    const { dark, setDark } = useTool()
    const containerRef = useRef<HTMLDivElement | null>(null);




    const toggleTheme = () => {
        if (dark) {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        } else {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        }
        setDark(!dark)
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpenSideMenu(false);
            }
        };

        window.addEventListener("mousedown", handleClickOutside)

        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        }

    }, [])



    return (
        <menu ref={containerRef} className=" z-[9999] dark:text-neutral-200 text-neutral-900 text-sm font-semibold flex-wrap py-3 px-1.5 min-h-[80vh] h-[80vh] w-[15vw] max-w-58 transition-all transform-view top-[8vh] absolute min-w-58 rounded-[8px] bg-neutral-200 dark:bg-neutral-800  " >
            <button onClick={toggleTheme} className="  py-2 px-1 w-full cursor-pointer flex items-center justify-between  hover:dark:bg-neutral-900 rounded-lg hover:bg-neutral-300/60  " >
                <span> Theme </span>
                {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className=" py-2 px-1 w-full cursor-pointer flex-wrap flex items-center justify-between  hover:dark:bg-neutral-900 rounded-lg hover:bg-neutral-300/60  " >
                <span> Canvas Background </span>
                <span className=" text-red-500 " >Beta</span>
                <span className=" w-7 rounded-lg h-7 absolute top-20 left-2 bg-neutral-50 " ></span>
                <span className=" w-7 rounded-lg h-7 absolute top-20 left-10 bg-neutral-100 " ></span>
                <span className=" w-7 rounded-lg h-7 absolute top-20 left-18 bg-neutral-200 " ></span>
                <span className=" w-7 rounded-lg h-7 absolute top-20 left-26 bg-neutral-300 " ></span>
                <span className=" w-7 rounded-lg h-7 absolute top-20 left-34 bg-neutral-400 " ></span>
            </button>
        </menu>
    )
}


export default function TopMenu() {
    const [openSideMenu, setOpenSideMenu] = useState<boolean>(false);

    const { tool, setTool } = useTool();
    // const openSideMenu = false
    return (
        <menu className=" z-[9999]  fixed bg-transparent top-2 w-full h-[9vh]  flex justify-between items-center py-3 px-4 gap-2 " >
            <section className=" w-[20%] h-full rounded-[16px] px-3 flex items-center   " >
                <button onClick={() => {
                    if (openSideMenu) {
                        return setOpenSideMenu(false)
                    }
                    setOpenSideMenu(true)
                }
                } className="dark:hover:bg-neutral-900 hover:bg-neutral-300 bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300/90 relative transition-all ease-in-out cursor-pointer  py-2 px-2 rounded-lg " >
                    <Menu />
                </button>
                {!!openSideMenu && <SideMenu setOpenSideMenu={setOpenSideMenu} />}
            </section>
            <section className=" w-auto h-full shadow-neutral-500 overflow-hidden text-neutral-700/90 dark:text-neutral-300/90  " >
                <div className=" h-full w-full overflow-hidden rounded-[8px] bg-neutral-200 dark:bg-neutral-800 py-2 px-3 flex gap-1 items-center " >
                    {
                        menuItems.map((item, idx) => (
                            <button onClick={() => {
                                setTool(item.name)
                            }}
                                key={idx}
                                className={` ${item.name === tool ? " bg-neutral-300 dark:bg-neutral-900 " : ""}  dark:hover:bg-neutral-900 overflow-hidden hover:bg-neutral-300 relative transition-all ease-in-out cursor-pointer  py-2 px-2 rounded-lg `} >
                                {item.icon}
                                <span className={` ${item.tag === "beta" ? " text-red-500 " : ""} text-[12px] font-semibold absolute bottom-0 right-0 `} >{idx}</span>
                            </button>
                        ))
                    }

                </div>
            </section>
            <section className=" w-[20%] h-full rounded-[16px] flex gap-2 justify-center items-center " >
                <Link target="_blank" className=" text-blue-500" href={"https://fabricjs.com/demos/"} >https://fabricjs.com/demos/</Link>
                <Link target="_blank" className=" p-2 rounded-lg text-neutral-800 dark:text-neutral-200 bg-neutral-200 dark:bg-neutral-800 "  href={"https://github.com/canvas"} ><Github/></Link>
            </section>
        </menu>
    )
}