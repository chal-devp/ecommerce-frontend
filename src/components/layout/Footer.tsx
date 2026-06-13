import { useNavigate } from "react-router-dom";

function Footer() {
  const Navigate = useNavigate();
  return (
    <>
      <div className="bg-slate-50 ">
        <div className=" mt-2 flex items-cneter min-h-56  justify-center gap-10 w-full p-6 font-bold text-sm bg-violet-400">
          <div className="grid grid-cols-1  text-white">
            {" "}
            <button
              className="hover:underline hover:cursor-pointer px-2 py-1 transition-all"
              onClick={() => {
                Navigate("/");
              }}
            >
              home
            </button>
            <button
              className="hover:underline hover:cursor-pointer px-2 py-1 transition-all"
              onClick={() => {
                Navigate("/");
              }}
            >
              services
            </button>
            <button
              className="hover:underline hover:cursor-pointer px-2 py-1 transition-all"
              onClick={() => {
                Navigate("/");
              }}
            >
              about
            </button>
          </div>

          <div className="grid grid-cols-1 text-white">
            {" "}
            <button
              className="hover:underline hover:cursor-pointer px-2 py-1 transition-all"
              onClick={() => {
                Navigate("/");
              }}
            >
              sponsers
            </button>
            <button
              className="hover:underline hover:cursor-pointer px-2 py-1 transition-all"
              onClick={() => {
                Navigate("/");
              }}
            >
              more
            </button>
            <button
              className="hover:underline hover:cursor-pointer px-2 py-1 transition-all"
              onClick={() => {
                Navigate("/");
              }}
            >
              visit
            </button>
          </div>
          <div className="grid grid-cols-1 text-white">
            {" "}
            <button
              className="hover:underline hover:cursor-pointer px-2 py-1 "
              onClick={() => {
                Navigate("/");
              }}
            >
              give us
            </button>
            <button
              className="hover:underline hover:cursor-pointer px-2 py-1"
              onClick={() => {
                Navigate("/");
              }}
            >
              information
            </button>
            <button
              className="hover:underline hover:cursor-pointer px-2 py-1 "
              onClick={() => {
                Navigate("/");
              }}
            >
              contact
            </button>
            <button
              className="  px-2 py-1 hover:underline hover:cursor-pointer border-none"
              onClick={() => {
                Navigate("/");
              }}
            >
              map
            </button>
          </div>
        </div>
        <div className="bg-pink-400">
          <div className=" min-h-56 w-full flex justify-between ">
            <div className=" flex-1 flex-col   items-center pt-5 pl-3">
              {" "}
              <button
                className="text-white text-center text-2xl font-bold bg-transparent hover:cursor-pointer  hover:underline hover:scale-105 ml-2  transition-transform "
                onClick={() => {
                  Navigate("/");
                }}
              >
                More info
              </button>
              <p className="text-xl text-white ml-2 ">
                Email :{" "}
                <button
                  onClick={() => {
                    Navigate("/selectmap");
                  }}
                  className=" text-sm font-bold  hover:underline hover:scale-105 hover:cursor-pointer  "
                >
                  Example@gmail.com
                </button>
              </p>
              <p className="text-white  text-xl ml-2">
                Phone :{" "}
                <span className=" text-sm font-bold ">+251 965121212</span>
              </p>
            </div>
            <div className="flex justify-between gap-7 items-center ">
              {" "}
              <button className="text-white hover:cursor-pointer">
                Facebook
              </button>
              <button className="text-white hover:cursor-pointer">
                TikTok
              </button>
              <button className="text-white hover:cursor-pointer">
                Linkedln
              </button>
              <button className="text-white hover:cursor-pointer">
                Whatsup
              </button>
              <button className="text-white mr-2 hover:cursor-pointer">
                Twiter
              </button>
            </div>{" "}
          </div>

          <p
            className="text-center p-5 mb-3
          "
          >
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. <br />{" "}
            Dolores nulla pariatur dolor itaque est <br />, at esse laborum
            officiis veritatis <br />
            beatae maiores maxime, aut unde, <br /> quia qui deserunt ab alias?
            Nam.
          </p>
        </div>
      </div>
    </>
  );
}
export default Footer;
