import ThemeToggle from '../theme-toggle'
import Logo from './logo'
import UserNavDropdown from './user-nav-dropdown'

function Navbar() {
  return (
    <header className="bg-secondary px-4 py-2">
      <nav className="flex justify-between">
        <Logo />
        <div className="flex items-center gap-x-2">
          <UserNavDropdown />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}

export default Navbar
