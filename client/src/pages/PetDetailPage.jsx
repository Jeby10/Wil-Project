import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Spinner,
  Center,
  Card,
  Image,
  SimpleGrid,
  Table
} from '@chakra-ui/react'
import { petAPI } from '../api/pet'
import { useAuth } from '../components/AuthProvider'

const PetDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [selectedImage, setSelectedImage] = useState(0)

  const { data, isLoading, error } = useQuery({
    queryKey: ['pet', id],
    queryFn: () => petAPI.getPet(id)
  })

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/pets/${id}` } })
      return
    }
    navigate(`/apply/${id}`)
  }

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
        <VStack gap={4}>
          <Text color="red.500" fontSize="xl">
            Error loading pet details
          </Text>
          <Button onClick={() => navigate('/')} colorPalette="teal">
            Back to Browse
          </Button>
        </VStack>
      </Center>
    )
  }

  const pet = data?.pet

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
            onClick={() => navigate('/')}
            variant="ghost"
            colorPalette="teal"
            alignSelf="flex-start"
          >
            ← Back to Browse
          </Button>

          {/* Pet Card - Single Column Layout */}
          <Card.Root
            bg="white"
            borderRadius="25px"
            shadow="lg"
            overflow="hidden"
            border="2px solid"
            borderColor="teal.100"
          >
            <Card.Body p={8}>
              <VStack align="stretch" gap={8}>
                {/* Pet Profile - Centered at Top */}
                <VStack align="center" gap={4}>
                  {pet.imageUrl && pet.imageUrl.length > 0 ? (
                    <>
                      {/* Main Image */}
                      <Box
                        borderRadius="15px"
                        overflow="hidden"
                        shadow="md"
                        position="relative"
                        width="full"
                        maxW="500px"
                      >
                        <Image
                          src={pet.imageUrl[selectedImage]}
                          alt={`${pet.name} - Image ${selectedImage + 1}`}
                          width="full"
                          height="400px"
                          objectFit="cover"
                        />
                        {pet.urgent && (
                          <Badge
                            position="absolute"
                            top={3}
                            right={3}
                            colorPalette="red"
                            variant="solid"
                            fontSize="md"
                            px={4}
                            py={2}
                          >
                            🚨 URGENT
                          </Badge>
                        )}
                        {pet.isAvailable ? (
                          <Badge
                            position="absolute"
                            top={3}
                            left={3}
                            colorPalette="green"
                            variant="solid"
                            fontSize="md"
                            px={4}
                            py={2}
                          >
                            ✓ Available
                          </Badge>
                        ) : (
                          <Badge
                            position="absolute"
                            top={3}
                            left={3}
                            colorPalette="gray"
                            variant="solid"
                            fontSize="md"
                            px={4}
                            py={2}
                          >
                            Adopted
                          </Badge>
                        )}
                      </Box>

                      {/* Image Thumbnails */}
                      {pet.imageUrl.length > 1 && (
                        <SimpleGrid columns={pet.imageUrl.length} gap={2} maxW="500px" width="full">
                          {pet.imageUrl.map((url, index) => (
                            <Box
                              key={index}
                              borderRadius="10px"
                              overflow="hidden"
                              cursor="pointer"
                              border={selectedImage === index ? '3px solid' : '2px solid'}
                              borderColor={selectedImage === index ? 'teal.500' : 'gray.200'}
                              transition="all 0.2s"
                              _hover={{ borderColor: 'teal.300' }}
                              onClick={() => setSelectedImage(index)}
                            >
                              <Image
                                src={url}
                                alt={`${pet.name} - Thumbnail ${index + 1}`}
                                width="full"
                                height="80px"
                                objectFit="cover"
                              />
                            </Box>
                          ))}
                        </SimpleGrid>
                      )}
                    </>
                  ) : (
                    <Text fontSize="9xl">{pet.emoji || '🐾'}</Text>
                  )}

                  {/* Pet Name */}
                  <Heading size="3xl" color="teal.600" textAlign="center">
                    {pet.name}
                  </Heading>

                  {/* Status Badges */}
                  <HStack gap={2}>
                    {!pet.imageUrl?.length && pet.urgent && (
                      <Badge colorPalette="red" variant="solid" fontSize="md" px={4} py={2}>
                        🚨 URGENT
                      </Badge>
                    )}
                    {!pet.imageUrl?.length && (
                      pet.isAvailable ? (
                        <Badge colorPalette="green" variant="solid" fontSize="md" px={4} py={2}>
                          ✓ Available
                        </Badge>
                      ) : (
                        <Badge colorPalette="gray" variant="solid" fontSize="md" px={4} py={2}>
                          Adopted
                        </Badge>
                      )
                    )}
                  </HStack>
                </VStack>

                {/* Specifications Table - Two Columns */}
                <Box>
                  <Heading size="lg" color="teal.600" mb={4}>
                    📋 Specifications
                  </Heading>
                  <Box
                    borderRadius="15px"
                    overflow="hidden"
                    border="2px solid"
                    borderColor="teal.100"
                  >
                    <Table.Root size="lg">
                      <Table.Body>
                        <Table.Row bg="teal.50">
                          <Table.Cell fontWeight="bold" color="teal.700" width="50%" py={4}>
                            🐕 Breed
                          </Table.Cell>
                          <Table.Cell color="gray.700" py={4}>{pet.breed}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell fontWeight="bold" color="teal.700" py={4}>
                            🏷️ Type
                          </Table.Cell>
                          <Table.Cell color="gray.700" py={4}>{pet.petType}</Table.Cell>
                        </Table.Row>
                        <Table.Row bg="teal.50">
                          <Table.Cell fontWeight="bold" color="teal.700" py={4}>
                            🎂 Age
                          </Table.Cell>
                          <Table.Cell color="gray.700" py={4}>
                            {pet.age}
                            {pet.ageInMonths && ` (${pet.ageInMonths} months)`}
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell fontWeight="bold" color="teal.700" py={4}>
                            📏 Size
                          </Table.Cell>
                          <Table.Cell color="gray.700" py={4}>{pet.size}</Table.Cell>
                        </Table.Row>
                        <Table.Row bg="teal.50">
                          <Table.Cell fontWeight="bold" color="teal.700" py={4}>
                            📍 Location
                          </Table.Cell>
                          <Table.Cell color="gray.700" py={4}>{pet.location}</Table.Cell>
                        </Table.Row>
                        {pet.healthStatus && (
                          <Table.Row>
                            <Table.Cell fontWeight="bold" color="teal.700" py={4}>
                              💚 Health
                            </Table.Cell>
                            <Table.Cell color="brand.green.600" py={4} fontWeight="medium">
                              {pet.healthStatus}
                            </Table.Cell>
                          </Table.Row>
                        )}
                      </Table.Body>
                    </Table.Root>
                  </Box>
                </Box>

                {/* About Section - Distinct Features, Likes, Activities */}
                {pet.description && (
                  <Box
                    bg="brand.green.50"
                    p={6}
                    borderRadius="15px"
                    border="2px solid"
                    borderColor="brand.green.100"
                  >
                    <Heading size="lg" color="brand.green.700" mb={3}>
                      💕 About {pet.name}
                    </Heading>
                    <Text color="gray.700" lineHeight="tall" fontSize="md">
                      {pet.description}
                    </Text>
                  </Box>
                )}

                {/* Call to Action Button */}
                {pet.isAvailable && (
                  <Button
                    onClick={handleApply}
                    size="xl"
                    bg="teal.500"
                    color="white"
                    _hover={{ bg: 'teal.600', transform: 'translateY(-2px)', shadow: 'lg' }}
                    mt={4}
                    width="full"
                    py={7}
                    fontSize="xl"
                    transition="all 0.2s"
                  >
                    🐾 Apply to Adopt {pet.name}
                  </Button>
                )}
              </VStack>
            </Card.Body>
          </Card.Root>
        </VStack>
      </Container>
    </Box>
  )
}

export default PetDetailPage
