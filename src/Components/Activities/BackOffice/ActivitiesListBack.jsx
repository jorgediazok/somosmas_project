/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivitiesList, searchActivitiesList } from '../../../features/activities/activitiesSlice';
import {
  Alert,
  AlertIcon,
  AspectRatio,
  Box,
  Button,
  HStack,
  Image,
  Stack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import LinkActivities from './LinkActivities';
import ModalDelete from '../../Backoffice/Utils/ModalDelete';
import ModalEdit from '../../Backoffice/Utils/ModalEdit';
import ActivitiesForm from '../ActivitiesForm';
import { SearchInput } from '../../Utils/SearchInput/SearchInput';
import Spinner from '../../Spinner/SpinnerComponent'

const ActivitiesListBack = () => {
  const dispatch = useDispatch();
  const [term, setTerm] = useState('');
  const [activitiesFiltered, setActivitiesFiltered] = useState([])
  const { activitiesList, searchResults, loading } = useSelector((state) => state.activities);

  // Modal Delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toDeleteActivity, setToDeleteActivity] = useState([]);
  const handleDeleteOpen = (activity) => {
    setIsDeleteOpen(true);
    setToDeleteActivity(activity);
  };
  // Modal edit
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [toEditActivity, setToEditActivity] = useState([]);
  const handleEditOpen = (activity) => {
    setIsEditOpen(true);
    setToEditActivity(activity);
  };

  useEffect(() => {
    dispatch(fetchActivitiesList());
  }, [isDeleteOpen, isEditOpen]);

  useEffect(() => {
    setActivitiesFiltered(activitiesList)
  }, [activitiesList])

  useEffect(() => {
    if (term.length >= 3) {
      dispatch(searchActivitiesList(term));
    }
  }, [term]);

  useEffect(() => {
    setActivitiesFiltered(searchResults)
  }, [searchResults])


  if (loading) return <Box alignItems="center" d="flex" justifyContent="center" minH="100vh"><Spinner /></Box>;

  return (
    <Box mt="3">
      <Text fontSize={24} fontWeight="bold" textAlign="center">
        Listado de Actividades
      </Text>
      <Box m="5">
        <HStack justifyContent="center" mb="2">
          <LinkActivities />
          <SearchInput
            onDebounce={(value) => {
              setTerm(value);
            }}
          />
        </HStack>
        <Table size="md" variant="striped">
          <Thead>
            <Tr>
              <Th textAlign="center">Nombre</Th>
              <Th textAlign="center">Imagen</Th>
              <Th textAlign="center">Fecha de creacion</Th>
              <Th textAlign="center">Accion</Th>
            </Tr>
          </Thead>
          <Tbody>
            {activitiesList.length > 0
              ? activitiesFiltered.map((activity, index) => (
                <Tr key={index}>
                  <Td textAlign="center">{activity.name}</Td>
                  <Td>
                    <AspectRatio maxW="100px" ratio={4 / 3}>
                      <Image
                        alt="Image Card"
                        fallbackSrc="../images/placeholder/100x100.png"
                        objectFit="cover"
                        src={activity.image}
                      />
                    </AspectRatio>
                  </Td>
                  <Td textAlign="center">{new Date(activity.created_at).toLocaleDateString()}</Td>
                  <Td textAlign="center">
                    <Button backgroundColor="yellow" onClick={() => handleEditOpen(activity)}>
                      Editar
                    </Button>
                    <Button
                      backgroundColor="red.500"
                      m="2"
                      onClick={() => handleDeleteOpen(activity)}
                    >
                      Borrar
                    </Button>
                  </Td>
                </Tr>
              ))
              : null}
          </Tbody>
        </Table>
        {!activitiesList.length && (
          <Box alignItems="center" d="flex" flexDirection="column" justifyContent="center" m="4">
            <Alert
              alignItems="center"
              d="flex"
              flexDirection="column"
              justifyContent="center"
              status="error"
              textAlign="center"
            >
              <AlertIcon />
              No hay actividades en este momento
            </Alert>
          </Box>
        )}
      </Box>
      <ModalDelete
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        setIsEditOpen={setIsEditOpen}
        toDeleteComponent="actividades"
        toDeleteObj={toDeleteActivity}
      />

      <ModalEdit isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen}>
        <ActivitiesForm activity={toEditActivity} setIsEditOpen={setIsEditOpen} />
      </ModalEdit>
    </Box>
  );
};
export default ActivitiesListBack;
