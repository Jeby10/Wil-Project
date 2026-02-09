import { Box, Card, Text, Badge, Button, VStack, HStack, Image } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router'

const PetCard = ({ pet }) => {
  return (
    <Card.Root
      borderRadius="25px"
      overflow="hidden"
      shadow="md"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-10px) scale(1.02)',
        shadow: 'xl'
      }}
      bg="bg.card"
    >
      {/* Pet Image */}
      {pet.imageUrl && pet.imageUrl.length > 0 ? (
        <Box position="relative">
          <Image
            src={pet.imageUrl[0]}
            alt={pet.name}
            width="full"
            height="250px"
            objectFit="cover"
          />
          {pet.urgent && (
            <Badge
              position="absolute"
              top={3}
              right={3}
              colorPalette="red"
              variant="solid"
              fontSize="xs"
              px={3}
              py={1}
            >
              🚨 URGENT
            </Badge>
          )}
        </Box>
      ) : (
        <Box bg="gray.100" height="250px" display="flex" alignItems="center" justifyContent="center" position="relative">
          <Text fontSize="7xl">{pet.emoji || '🐾'}</Text>
          {pet.urgent && (
            <Badge
              position="absolute"
              top={3}
              right={3}
              colorPalette="red"
              variant="solid"
              fontSize="xs"
              px={3}
              py={1}
            >
              🚨 URGENT
            </Badge>
          )}
        </Box>
      )}

      <Card.Body p={6}>
        <VStack align="stretch" gap={3}>

          {/* Pet Name */}
          <Text fontSize="2xl" fontWeight="bold" color="teal.600">
            {pet.name}
          </Text>

          {/* Pet Details */}
          <VStack align="stretch" gap={1} fontSize="sm" color="gray.600">
            <HStack>
              <Text fontWeight="semibold">Breed:</Text>
              <Text>{pet.breed}</Text>
            </HStack>

            <HStack>
              <Text fontWeight="semibold">Age:</Text>
              <Text>{pet.age}</Text>
            </HStack>

            <HStack>
              <Text fontWeight="semibold">Size:</Text>
              <Text>{pet.size}</Text>
            </HStack>

            <HStack>
              <Text fontWeight="semibold">Location:</Text>
              <Text>{pet.location}</Text>
            </HStack>
          </VStack>

          {/* Description Preview */}
          {pet.description && (
            <Text fontSize="sm" color="gray.500" noOfLines={2}>
              {pet.description}
            </Text>
          )}

          {/* Learn More Button */}
          <RouterLink to={`/pets/${pet._id}`}>
            <Button
              width="full"
              bg="teal.500"
              color="white"
              _hover={{ bg: 'teal.600' }}
              mt={2}
            >
              Learn More
            </Button>
          </RouterLink>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}

export default PetCard
