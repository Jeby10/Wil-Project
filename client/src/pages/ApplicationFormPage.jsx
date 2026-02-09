import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Input,
  Textarea,
  Card,
  Spinner,
  Center
} from '@chakra-ui/react'
import { Field } from '../components/ui/field'
import { NativeSelectRoot, NativeSelectField } from '../components/ui/native-select'
import { Toaster, toaster } from '../components/ui/toaster'
import { petAPI } from '../api/pet'
import { applicationAPI } from '../api/application'
import { useAuth } from '../components/AuthProvider'

const ApplicationFormPage = () => {
  const { petId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    applicantName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    experience: '',
    reason: ''
  })

  // Fetch pet details
  const { data: petData, isLoading: petLoading } = useQuery({
    queryKey: ['pet', petId],
    queryFn: () => petAPI.getPet(petId)
  })

  // Submit application mutation
  const submitMutation = useMutation({
    mutationFn: applicationAPI.submitApplication,
    onSuccess: () => {
      toaster.create({
        title: 'Application submitted!',
        description: 'We will review your application and get back to you soon.',
        type: 'success',
        duration: 5000
      })
      navigate('/my-applications')
    },
    onError: (error) => {
      toaster.create({
        title: 'Application failed',
        description: error.response?.data?.error || error.message,
        type: 'error',
        duration: 5000
      })
    }
  })

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const pet = petData?.pet

    if (!pet) {
      toaster.create({
        title: 'Pet not found',
        type: 'error'
      })
      return
    }

    const applicationData = {
      ...formData,
      petId: pet._id,
      petName: pet.name,
      petType: pet.petType
    }

    submitMutation.mutate(applicationData)
  }

  if (petLoading) {
    return (
      <Center minH="calc(100vh - 200px)">
        <Spinner size="xl" color="teal.500" />
      </Center>
    )
  }

  const pet = petData?.pet

  if (!pet) {
    return (
      <Center minH="calc(100vh - 200px)">
        <VStack gap={4}>
          <Text fontSize="xl" color="gray.500">
            Pet not found
          </Text>
          <Button onClick={() => navigate('/')} colorPalette="teal">
            Back to Browse
          </Button>
        </VStack>
      </Center>
    )
  }

  return (
    <Box bg="bg.primary" minH="calc(100vh - 200px)" py={8}>
      <Container maxW="container.md">
        <VStack align="stretch" gap={6}>
          {/* Back Button */}
          <Button
            onClick={() => navigate(`/pets/${petId}`)}
            variant="ghost"
            colorPalette="teal"
            alignSelf="flex-start"
          >
            ← Back to {pet.name}'s Profile
          </Button>

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
                    {pet.emoji || '🐾'}
                  </Text>
                  <Heading size="2xl" color="teal.600" mb={2}>
                    Adopt {pet.name}
                  </Heading>
                  <Text color="gray.600">
                    Fill out this application to start the adoption process
                  </Text>
                </Box>

                <form onSubmit={handleSubmit}>
                  <VStack align="stretch" gap={4}>
                    <Field label="Your Full Name" required>
                      <Input
                        name="applicantName"
                        value={formData.applicantName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </Field>

                    <Field label="Email Address" required>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </Field>

                    <Field label="Phone Number" required>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(555) 123-4567"
                        required
                      />
                    </Field>

                    <Field label="Home Address" required>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Main St, City, State, ZIP"
                        required
                      />
                    </Field>

                    <Field label="Pet Ownership Experience (Optional)">
                      <Textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="Tell us about your experience with pets..."
                        rows={4}
                      />
                    </Field>

                    <Field label="Why do you want to adopt this pet?" required>
                      <Textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        placeholder="Tell us why you'd be a great match for this pet..."
                        rows={4}
                        required
                      />
                    </Field>

                    <Button
                      type="submit"
                      bg="teal.500"
                      color="white"
                      _hover={{ bg: 'teal.600' }}
                      size="lg"
                      mt={4}
                      loading={submitMutation.isPending}
                    >
                      Submit Application
                    </Button>
                  </VStack>
                </form>
              </VStack>
            </Card.Body>
          </Card.Root>
        </VStack>
      </Container>
      <Toaster />
    </Box>
  )
}

export default ApplicationFormPage
