interface HomeHeaderProps {
    token: string | null;
    authError: string | null;
    onLogin: () => void;
    onLogout: () => void;
}

export const HomeHeader = ({ token, authError, onLogin, onLogout }: HomeHeaderProps) => (
    <header className="text-center pb-5 border-b border-gray-700">
        <h1 className="text-2xl">Spotify Home</h1>
        {!token ? (
            authError ? (
                <div className="text-red-500 text-center">
                    <p>Error during authentication: {authError}</p>
                    <button onClick={onLogin} className="bg-green-500 text-white rounded-full px-5 py-2 mt-2 cursor-pointer">
                        Try logging in again
                    </button>
                </div>
            ) : (
                <button onClick={onLogin} className="bg-green-500 text-white rounded-full px-5 py-2 mt-2 cursor-pointer">
                    Log in with Spotify
                </button>
            )
        ) : (
            <button onClick={onLogout} className="bg-green-500 text-white rounded-full px-5 py-2 mt-2 cursor-pointer">
                Log out
            </button>
        )}
    </header>
);