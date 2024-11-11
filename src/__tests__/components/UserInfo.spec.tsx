// __tests__/components/UserInfo.spec.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SpotifyUser } from '../../interfaces/SpotifyUser.interface';
import UserInfo from '../../components/spotify/UserInfo';

// Mock user data for testing
const mockUser: SpotifyUser = {
    display_name: 'John Doe',
    email: 'john.doe@example.com',
    country: 'US',
    followers: { total: 123 },
    external_urls: { spotify: 'https://spotify.com/user/johndoe' },
    images: [{ url: 'https://example.com/profile.jpg' }],
};

describe('UserInfo Component', () => {
    it('renders the user name correctly', () => {
        render(<UserInfo user={mockUser} />);
        expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
    });

    it('displays the profile image if available', () => {
        render(<UserInfo user={mockUser} />);
        const profileImage = screen.getByAltText('Profile');
        expect(profileImage).toBeInTheDocument();
        expect(profileImage).toHaveAttribute('src', 'https://example.com/profile.jpg');
    });

    it('renders a link to the user’s Spotify profile', () => {
        render(<UserInfo user={mockUser} />);
        const profileLink = screen.getByRole('link', { name: 'https://spotify.com/user/johndoe' });
        expect(profileLink).toHaveAttribute('href', 'https://spotify.com/user/johndoe');
        expect(profileLink).toHaveAttribute('target', '_blank');
        expect(profileLink).toHaveAttribute('rel', 'noreferrer');
    });

    it('does not display profile image if none is available', () => {
        const userWithoutImage = { ...mockUser, images: [] };
        render(<UserInfo user={userWithoutImage} />);
        expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
    });
});
