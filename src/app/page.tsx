import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        {/* Welcome Section */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Web Game Collection</h1>
          <p className="text-gray-600 mb-6">Enjoy classic games right in your browser!</p>
        </div>

        {/* Game Collection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          <Link 
            href="/othello"
            className="group block p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-white">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">Othello</h2>
                <div className="flex space-x-1">
                  <div className="w-4 h-4 bg-gray-900 rounded-full"></div>
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded-full"></div>
                </div>
              </div>
              <p className="text-green-100 text-sm mb-3">
                Strategic board game where you flip your opponent&apos;s pieces to win!
              </p>
              <div className="flex items-center space-x-2 text-green-200 text-xs">
                <span>• Human vs Human</span>
                <span>• Human vs AI</span>
              </div>
            </div>
          </Link>
          
          {/* Placeholder for future games */}
          <div className="p-6 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-gray-500 text-center">
              <h3 className="font-semibold mb-2">More Games Coming Soon!</h3>
              <p className="text-sm">Stay tuned for more exciting games</p>
            </div>
          </div>
        </div>

        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left mt-8">
          <li className="mb-2 tracking-[-.01em]">
            Get started by exploring our{" "}
            <Link href="/othello" className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded hover:bg-black/[.1] dark:hover:bg-white/[.1] transition-colors">
              Othello Game
            </Link>
            .
          </li>
          <li className="tracking-[-.01em]">
            Challenge yourself against AI or play with friends!
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="/othello"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            <span className="text-lg">🎮</span>
            Play Othello
          </Link>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://github.com/tomo1833/web-game"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Source
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-sm">Built with Next.js and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
