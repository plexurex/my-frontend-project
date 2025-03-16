import Link from 'next/link';

export default function MainMenu() {
    return (
        <div>
            <h1>Welcome to the Migration Helper!</h1>
            <Link href="/preferences">
                <button>Find a Place to Migrate</button>
            </Link>
        </div>
    );
}
