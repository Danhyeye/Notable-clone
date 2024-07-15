import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-6">Welcome to Note Keeper</h1>
                <p className="text-xl mb-6">
                    Organize your thoughts and ideas in one place.
                </p>
                <div className="flex justify-center space-x-4">
                    <Link to="/login">
                        <button
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-8 rounded-full shadow-lg border border-white transition-transform transform duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-300"
                        >
                            Get Started
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
