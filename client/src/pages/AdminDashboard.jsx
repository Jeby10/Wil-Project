import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Card,
  Spinner,
  Center,
  Grid,
  Textarea
} from '@chakra-ui/react'
import { NativeSelectRoot, NativeSelectField } from '../components/ui/native-select'
import { Field } from '../components/ui/field'
import { Toaster, toaster } from '../components/ui/toaster'
import { applicationAPI } from '../api/application'

const ApplicationCard = ({ application, onUpdate }) => {
  const [status, setStatus] = useState(application.status)
  const [notes, setNotes] = useState(application.notes || '')
  const [isEditing, setIsEditing] = useState(false)

  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => applicationAPI.updateApplication(id, data),
    onSuccess: () => {
      toaster.create({
        title: 'Application updated',
        type: 'success',
        duration: 3000
      })
      queryClient.invalidateQueries(['adminApplications'])
      queryClient.invalidateQueries(['applicationStats'])
      setIsEditing(false)
    },
    onError: (error) => {
      toaster.create({
        title: 'Update failed',
        description: error.response?.data?.error || error.message,
        type: 'error',
        duration: 5000
      })
    }
  })

  const handleUpdate = () => {
    updateMutation.mutate({
      id: application._id,
      data: { status, notes }
    })
  }

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
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card.Root borderRadius="20px" shadow="md" bg="white">
      <Card.Body p={6}>
        <VStack align="stretch" gap={4}>
          {/* Header */}
          <HStack justify="space-between">
            <HStack>
              <Text fontSize="2xl">{application.petId?.emoji || '🐾'}</Text>
              <Box>
                <Heading size="md" color="teal.600">
                  {application.petName}
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Applicant: {application.applicantId?.username || application.applicantName}
                </Text>
              </Box>
            </HStack>

            <Badge
              colorPalette={getStatusColor(application.status)}
              variant="solid"
              fontSize="xs"
            >
              {application.status.toUpperCase()}
            </Badge>
          </HStack>

          {/* Application Details */}
          <VStack align="stretch" gap={1} fontSize="sm" color="gray.600">
            <HStack>
              <Text fontWeight="semibold">Email:</Text>
              <Text>{application.email}</Text>
            </HStack>

            <HStack>
              <Text fontWeight="semibold">Phone:</Text>
              <Text>{application.phone}</Text>
            </HStack>

            <HStack>
              <Text fontWeight="semibold">Address:</Text>
              <Text>{application.address}</Text>
            </HStack>

            <HStack>
              <Text fontWeight="semibold">Submitted:</Text>
              <Text>{formatDate(application.submittedDate)}</Text>
            </HStack>

            {application.reason && (
              <Box mt={2}>
                <Text fontWeight="semibold">Reason:</Text>
                <Text fontSize="xs" color="gray.600">
                  {application.reason}
                </Text>
              </Box>
            )}

            {application.experience && (
              <Box mt={1}>
                <Text fontWeight="semibold">Experience:</Text>
                <Text fontSize="xs" color="gray.600">
                  {application.experience}
                </Text>
              </Box>
            )}
          </VStack>

          {/* Edit Controls */}
          {isEditing ? (
            <VStack align="stretch" gap={3} mt={2}>
              <Field label="Status">
                <NativeSelectRoot>
                  <NativeSelectField
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </NativeSelectField>
                </NativeSelectRoot>
              </Field>

              <Field label="Admin Notes">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this application..."
                  rows={3}
                />
              </Field>

              <HStack gap={2}>
                <Button
                  onClick={handleUpdate}
                  bg="teal.500"
                  color="white"
                  _hover={{ bg: 'teal.600' }}
                  size="sm"
                  flex={1}
                  loading={updateMutation.isPending}
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => {
                    setStatus(application.status)
                    setNotes(application.notes || '')
                    setIsEditing(false)
                  }}
                  variant="outline"
                  size="sm"
                  flex={1}
                >
                  Cancel
                </Button>
              </HStack>
            </VStack>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              colorPalette="teal"
              size="sm"
              mt={2}
            >
              Update Application
            </Button>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}

const AdminDashboard = () => {
  const [statusFilter, setStatusFilter] = useState('all')

  const { data: statsData } = useQuery({
    queryKey: ['applicationStats'],
    queryFn: applicationAPI.getApplicationStats
  })

  const { data: applicationsData, isLoading, error } = useQuery({
    queryKey: ['adminApplications', statusFilter],
    queryFn: () => applicationAPI.getAllApplications(statusFilter)
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

  const applications = applicationsData?.applications || []
  const stats = statsData || { total: 0, pending: 0, approved: 0, rejected: 0 }

  return (
    <Box bg="bg.primary" minH="calc(100vh - 200px)" py={8}>
      <Container maxW="container.xl">
        <VStack align="stretch" gap={6}>
          <Box>
            <Heading size="3xl" color="teal.600" mb={2}>
              Admin Dashboard
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Manage adoption applications
            </Text>
          </Box>

          {/* Statistics */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
            <Card.Root bg="white" borderRadius="15px" shadow="md">
              <Card.Body p={4} textAlign="center">
                <Text fontSize="3xl" fontWeight="bold" color="teal.500">
                  {stats.total}
                </Text>
                <Text color="gray.600">Total</Text>
              </Card.Body>
            </Card.Root>

            <Card.Root bg="white" borderRadius="15px" shadow="md">
              <Card.Body p={4} textAlign="center">
                <Text fontSize="3xl" fontWeight="bold" color="yellow.500">
                  {stats.pending}
                </Text>
                <Text color="gray.600">Pending</Text>
              </Card.Body>
            </Card.Root>

            <Card.Root bg="white" borderRadius="15px" shadow="md">
              <Card.Body p={4} textAlign="center">
                <Text fontSize="3xl" fontWeight="bold" color="green.500">
                  {stats.approved}
                </Text>
                <Text color="gray.600">Approved</Text>
              </Card.Body>
            </Card.Root>

            <Card.Root bg="white" borderRadius="15px" shadow="md">
              <Card.Body p={4} textAlign="center">
                <Text fontSize="3xl" fontWeight="bold" color="red.500">
                  {stats.rejected}
                </Text>
                <Text color="gray.600">Rejected</Text>
              </Card.Body>
            </Card.Root>
          </Grid>

          {/* Filter */}
          <Box bg="white" p={4} borderRadius="15px" shadow="md">
            <HStack>
              <Text fontWeight="semibold" minW="100px">
                Filter by:
              </Text>
              <NativeSelectRoot maxW="300px">
                <NativeSelectField
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Applications</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </NativeSelectField>
              </NativeSelectRoot>
            </HStack>
          </Box>

          {/* Applications List */}
          {applications.length === 0 ? (
            <Center py={12}>
              <VStack gap={4}>
                <Text fontSize="5xl">📋</Text>
                <Heading size="lg" color="gray.500">
                  No Applications Found
                </Heading>
                <Text color="gray.500">
                  {statusFilter !== 'all'
                    ? `No ${statusFilter} applications at the moment`
                    : 'No applications have been submitted yet'}
                </Text>
              </VStack>
            </Center>
          ) : (
            <>
              <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                Showing {applications.length}{' '}
                {statusFilter !== 'all' ? statusFilter : ''} application
                {applications.length !== 1 ? 's' : ''}
              </Text>

              <Grid
                templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
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
      <Toaster />
    </Box>
  )
}

export default AdminDashboard
