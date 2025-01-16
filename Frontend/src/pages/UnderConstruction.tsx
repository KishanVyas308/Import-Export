import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const UnderDevelopment = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // Navigates to the previous page
    };

    return (
        
        <div className="bg-[#e6e7e9] w-full h-full min-h-screen">
        <div className="container mx-auto px-4 py-8 ">
            <DotLottieReact
                src="https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json"
                autoplay
                loop
                className="w-1/2 h-1/2"
            />
            <h1 className="text-4xl font-bold mb-4">Under Development</h1>
            <p className="mb-8 text-lg">This page is Under Development. Stay tuned!</p>
            
             <button
                onClick={goBack}
                className="px-6 py-3 text-lg bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                Go Back
            </button>
        </div>
    </div>
    );
};



export default UnderDevelopment;



