import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Container,
  Box,
  Heading,
  Text,
  Grid,
  VStack,
  HStack,
  Input,
  Button,
  Spinner,
  Center
} from '@chakra-ui/react'
import { Field } from '../components/ui/field'
import { NativeSelectRoot, NativeSelectField } from '../components/ui/native-select'
import { petAPI } from '../api/pet'
import PetCard from '../components/PetCard'

const HomePage = () => {
  const [filters, setFilters] = useState({
    petType: '',
    size: '',
    age: '',
    breed: '',
    location: '',
    urgent: ''
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['pets', filters],
    queryFn: () => {
      // Remove empty filters
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      )
      return petAPI.getPets(activeFilters)
    }
  })

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const clearFilters = () => {
    setFilters({
      petType: '',
      size: '',
      age: '',
      breed: '',
      location: '',
      urgent: ''
    })
  }

  return (
    <Box bg="bg.primary" minH="calc(100vh - 200px)" py={8}>
      <Container maxW="container.xl">
        <VStack align="stretch" gap={8}>
          {/* Hero Section */}
          <Box textAlign="center" py={8}>
            <Heading size="4xl" color="teal.600" mb={4}>
              Find Your Perfect Pet
            </Heading>
            <Text fontSize="xl" color="gray.600">
              Browse our available pets and give them a loving home
            </Text>
          </Box>

          {/* Filters */}
          <Box
            bg="white"
            p={6}
            borderRadius="20px"
            shadow="md"
            border="2px solid"
            borderColor="teal.100"
          >
            <Heading size="lg" mb={4} color="teal.600">
              Filter Pets
            </Heading>

            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
              <Field label="Pet Type">
                <NativeSelectRoot>
                  <NativeSelectField
                    value={filters.petType}
                    onChange={(e) => handleFilterChange('petType', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Other">Other</option>
                  </NativeSelectField>
                </NativeSelectRoot>
              </Field>

              <Field label="Size">
                <NativeSelectRoot>
                  <NativeSelectField
                    value={filters.size}
                    onChange={(e) => handleFilterChange('size', e.target.value)}
                  >
                    <option value="">All Sizes</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </NativeSelectField>
                </NativeSelectRoot>
              </Field>

              <Field label="Age">
                <NativeSelectRoot>
                  <NativeSelectField
                    value={filters.age}
                    onChange={(e) => handleFilterChange('age', e.target.value)}
                  >
                    <option value="">All Ages</option>
                    <option value="Puppy/Kitten">Puppy/Kitten</option>
                    <option value="Young">Young</option>
                    <option value="Adult">Adult</option>
                    <option value="Senior">Senior</option>
                  </NativeSelectField>
                </NativeSelectRoot>
              </Field>

              <Field label="Breed">
                <Input
                  placeholder="Search by breed..."
                  value={filters.breed}
                  onChange={(e) => handleFilterChange('breed', e.target.value)}
                />
              </Field>

              <Field label="Location">
                <Input
                  placeholder="Search by location..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </Field>

              <Field label="Urgent Only">
                <NativeSelectRoot>
                  <NativeSelectField
                    value={filters.urgent}
                    onChange={(e) => handleFilterChange('urgent', e.target.value)}
                  >
                    <option value="">All Pets</option>
                    <option value="true">Urgent Only</option>
                  </NativeSelectField>
                </NativeSelectRoot>
              </Field>
            </Grid>

            <HStack justify="flex-end" mt={4}>
              <Button
                onClick={clearFilters}
                variant="outline"
                colorPalette="teal"
              >
                Clear Filters
              </Button>
            </HStack>
          </Box>

          {/* Results Count */}
          {data && (
            <Text fontSize="lg" fontWeight="semibold" color="gray.600">
              Found {data.count} {data.count === 1 ? 'pet' : 'pets'}
            </Text>
          )}

          {/* Pet Grid */}
          {isLoading ? (
            <Center py={12}>
              <Spinner size="xl" color="teal.500" />
            </Center>
          ) : error ? (
            <Center py={12}>
              <Text color="red.500">Error loading pets: {error.message}</Text>
            </Center>
          ) : data && data.pets && data.pets.length > 0 ? (
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
              gap={6}
            >
              {data.pets.map((pet) => (
                <PetCard key={pet._id} pet={pet} />
              ))}
            </Grid>
          ) : (
            <Center py={12}>
              <VStack gap={4}>
                <Text fontSize="2xl" color="gray.400">
                  🐾
                </Text>
                <Text fontSize="lg" color="gray.500">
                  No pets found matching your criteria
                </Text>
                <Button onClick={clearFilters} colorPalette="teal">
                  Clear Filters
                </Button>
              </VStack>
            </Center>
          )}
        </VStack>
      </Container>
    </Box>
  )
}

export default HomePage
