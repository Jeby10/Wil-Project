import { useState } from 'react'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router'
import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Input,
  Card
} from '@chakra-ui/react'
import { Field } from '../components/ui/field'
import { Toaster, toaster } from '../components/ui/toaster'
import { useAuth } from '../components/AuthProvider'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const from = location.state?.from || '/'

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(formData)

    if (result.success) {
      toaster.create({
        title: 'Login successful!',
        type: 'success',
        duration: 3000
      })
      navigate(from, { replace: true })
    } else {
      toaster.create({
        title: 'Login failed',
        description: result.error || 'Invalid credentials',
        type: 'error',
        duration: 5000
      })
    }

    setLoading(false)
  }

  return (
    <Box bg="bg.primary" minH="calc(100vh - 200px)" py={12}>
      <Container maxW="md">
        <Card.Root
          bg="white"
          borderRadius="25px"
          shadow="lg"
          border="2px solid"
          borderColor="teal.100"
        >
          <Card.Body p={8}>
            <VStack align="stretch" gap={6}>
              <Box textAlign="center">
                <Text fontSize="5xl" mb={2}>
                  🐾
                </Text>
                <Heading size="2xl" color="teal.600" mb={2}>
                  Welcome Back!
                </Heading>
                <Text color="gray.600">Login to continue your pet adoption journey</Text>
              </Box>

              <form onSubmit={handleSubmit}>
                <VStack align="stretch" gap={4}>
                  <Field label="Email" required>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </Field>

                  <Field label="Password" required>
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </Field>

                  <Button
                    type="submit"
                    bg="teal.500"
                    color="white"
                    _hover={{ bg: 'teal.600' }}
                    size="lg"
                    mt={2}
                    loading={loading}
                  >
                    Login
                  </Button>
                </VStack>
              </form>

              <Box textAlign="center">
                <Text color="gray.600">
                  Don't have an account?{' '}
                  <RouterLink to="/register">
                    <Text as="span" color="teal.500" fontWeight="semibold">
                      Register here
                    </Text>
                  </RouterLink>
                </Text>
              </Box>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Container>
      <Toaster />
    </Box>
  )
}

export default LoginPage
