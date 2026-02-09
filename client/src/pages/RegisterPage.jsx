import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router'
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

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toaster.create({
        title: 'Passwords do not match',
        type: 'error',
        duration: 3000
      })
      return
    }

    setLoading(true)

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password
    })

    if (result.success) {
      toaster.create({
        title: 'Registration successful!',
        description: 'Welcome to Fur Fetch!',
        type: 'success',
        duration: 3000
      })
      navigate('/', { replace: true })
    } else {
      toaster.create({
        title: 'Registration failed',
        description: result.error || 'Please try again',
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
                  Join Fur Fetch
                </Heading>
                <Text color="gray.600">Create an account to adopt your perfect pet</Text>
              </Box>

              <form onSubmit={handleSubmit}>
                <VStack align="stretch" gap={4}>
                  <Field label="Username" required>
                    <Input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      required
                    />
                  </Field>

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
                      placeholder="Create a password"
                      required
                    />
                  </Field>

                  <Field label="Confirm Password" required>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
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
                    Register
                  </Button>
                </VStack>
              </form>

              <Box textAlign="center">
                <Text color="gray.600">
                  Already have an account?{' '}
                  <RouterLink to="/login">
                    <Text as="span" color="teal.500" fontWeight="semibold">
                      Login here
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

export default RegisterPage
