import { useEffect, useState, useRef } from "react";

function RandomNumberPicker() {
    const [number, setNumber] = useState(1);
    const timerRef = useRef<number | null>(null);
    const numbersRef = useRef([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const shuffle = () => {
        const numbers = [...numbersRef.current];
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        numbersRef.current = numbers;
        return numbers[0];
    };

    useEffect(() => {
        let elapsed = 0;
        const duration = 3000;
        const interval = 100;

        timerRef.current = window.setInterval(() => {
            setNumber(shuffle());
            elapsed += interval;

            if (elapsed >= duration && timerRef.current) {
                clearInterval(timerRef.current);
            }
        }, interval);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    return (
        <div
            style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                textAlign: 'center',
                margin: '2rem',
                padding: '2rem',
                borderRadius: '8px',
                backgroundColor: '#f5f5f5',
                color: 'black',
                transition: 'all 0.1s ease-in-out'
            }}
        >
            {number}
        </div>
    );
}

export default RandomNumberPicker;