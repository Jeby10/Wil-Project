import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Card,
  Spinner,
  Center,
  Grid
} from '@chakra-ui/react'
import { applicationAPI } from '../api/application'

const ApplicationCard = ({ application }) => {
  const navigate = useNavigate()

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'green'
      case 'rejected':
        return 'red'
      default:
        return 'yellow'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Card.Root
      borderRadius="20px"
      shadow="md"
      bg="white"
      _hover={{ shadow: 'lg' }}
      cursor="pointer"
      onClick={() => navigate(`/pets/${application.petId._id}`)}
    >
      <Card.Body p={6}>
        <VStack align="stretch" gap={3}>
          <HStack justify="space-between" align="start">
            <HStack>
              <Text fontSize="3xl">{application.petId.emoji || '🐾'}</Text>
              <Box>
                <Heading size="lg" color="teal.600">
                  {application.petName}
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  {application.petType}
                </Text>
              </Box>
            </HStack>

            <Badge
              colorPalette={getStatusColor(application.status)}
              variant="solid"
              fontSize="sm"
              px={3}
              py={1}
            >
              {application.status.toUpperCase()}
            </Badge>
          </HStack>

          <VStack align="stretch" gap={1} fontSize="sm" color="gray.600">
            <HStack>
              <Text fontWeight="semibold">Submitted:</Text>
              <Text>{formatDate(application.submittedDate)}</Text>
            </HStack>

            <HStack>
              <Text fontWeight="semibold">Breed:</Text>
              <Text>{application.petId.breed}</Text>
            </HStack>

            <HStack>
              <Text fontWeight="semibold">Location:</Text>
              <Text>{application.petId.location}</Text>
            </HStack>

            {application.notes && (
              <Box mt={2} p={3} bg="gray.50" borderRadius="md">
                <Text fontWeight="semibold" mb={1}>
                  Admin Notes:
                </Text>
                <Text fontSize="sm">{application.notes}</Text>
              </Box>
            )}
          </VStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}

const MyApplicationsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myApplications'],
    queryFn: applicationAPI.getMyApplications
  })

  if (isLoading) {
    return (
      <Center minH="calc(100vh - 200px)">
        <Spinner size="xl" color="teal.500" />
      </Center>
    )
  }

  if (error) {
    return (
      <Center minH="calc(100vh - 200px)">
        <Text color="red.500" fontSize="xl">
          Error loading applications: {error.message}
        </Text>
      </Center>
    )
  }

  const applications = data?.applications || []

  return (
    <Box bg="bg.primary" minH="calc(100vh - 200px)" py={8}>
      <Container maxW="container.xl">
        <VStack align="stretch" gap={6}>
          <Box>
            <Heading size="3xl" color="teal.600" mb={2}>
              My Applications
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Track the status of your adoption applications
            </Text>
          </Box>

          {applications.length === 0 ? (
            <Center py={12}>
              <VStack gap={4}>
                <Text fontSize="5xl">🐾</Text>
                <Heading size="lg" color="gray.500">
                  No Applications Yet
                </Heading>
                <Text color="gray.500">
                  Browse our available pets and submit an application to get started!
                </Text>
              </VStack>
            </Center>
          ) : (
            <>
              <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                Total Applications: {applications.length}
              </Text>

              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                gap={6}
              >
                {applications.map((application) => (
                  <ApplicationCard key={application._id} application={application} />
                ))}
              </Grid>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  )
}

export default MyApplicationsPage
