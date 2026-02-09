import { Outlet, Link as RouterLink } from 'react-router'
import { Box, Container, Flex, HStack, Button, Text } from '@chakra-ui/react'
import { useAuth } from './AuthProvider'

const Header = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()

  return (
    <Box as="header" bg="teal.500" color="white" py={4} shadow="md">
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          {/* Logo/Brand */}
          <RouterLink to="/">
            <Text fontSize="2xl" fontWeight="bold" _hover={{ opacity: 0.8 }}>
              🐾 Fur Fetch
            </Text>
          </RouterLink>

          {/* Navigation */}
          <HStack gap={4}>
            <RouterLink to="/">
              <Button variant="ghost" color="white" _hover={{ bg: 'teal.600' }}>
                Browse Pets
              </Button>
            </RouterLink>

            {isAuthenticated ? (
              <>
                <RouterLink to="/my-applications">
                  <Button variant="ghost" color="white" _hover={{ bg: 'teal.600' }}>
                    My Applications
                  </Button>
                </RouterLink>

                {isAdmin && (
                  <RouterLink to="/admin">
                    <Button variant="ghost" color="white" _hover={{ bg: 'teal.600' }}>
                      Admin Dashboard
                    </Button>
                  </RouterLink>
                )}

                <Text fontSize="sm">Welcome, {user?.username}!</Text>

                <Button
                  onClick={logout}
                  variant="outline"
                  color="white"
                  borderColor="white"
                  _hover={{ bg: 'teal.600' }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <RouterLink to="/login">
                  <Button variant="ghost" color="white" _hover={{ bg: 'teal.600' }}>
                    Login
                  </Button>
                </RouterLink>

                <RouterLink to="/register">
                  <Button
                    variant="solid"
                    bg="white"
                    color="teal.600"
                    _hover={{ bg: 'teal.50' }}
                  >
                    Register
                  </Button>
                </RouterLink>
              </>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

const Footer = () => {
  return (
    <Box as="footer" bg="teal.50" py={8} mt="auto">
      <Container maxW="container.xl">
        <Flex direction="column" align="center" gap={2}>
          <Text fontSize="2xl" fontWeight="bold" color="teal.600">
            🐾 Fur Fetch
          </Text>
          <Text fontSize="sm" color="teal.700">
            Helping pets find loving homes since 2026
          </Text>
          <Text fontSize="xs" color="teal.500" mt={2}>
            &copy; 2026 Fur Fetch Pet Adoption Portal. All rights reserved.
          </Text>
        </Flex>
      </Container>
    </Box>
  )
}

const Layout = () => {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Box as="main" flex="1" bg="bg.primary">
        <Outlet />
      </Box>
      <Footer />
    </Flex>
  )
}

export default Layout
