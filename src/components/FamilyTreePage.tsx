import React, { useEffect, useState } from 'react';
import FamilyTree from '../data/FamilyTree';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Card,
  CardContent,
  Collapse,
  Container,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Relationship } from '../types/types';
import { RELATIONSHIPS } from '../constants/constants';
import Person from '../data/Person';

const FamilyTreePage = (): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [familyTree, setFamilyTree] = useState<FamilyTree | null>(null);
  const [memberNames, setMemberNames] = useState<string[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedRelationship, setSelectedRelationship] =
    useState<Relationship | null>(null);
  const [resolvedMembers, setResolvedMembers] = useState<Person[] | null>(null);

  useEffect(() => {
    fetch(
      `${
        process.env.NODE_ENV === 'production'
          ? process.env.REACT_APP_WEBSITE_URL
          : './king-shan-family-tree'
      }/family-data.json`
    )
      .then(async (response) => await response.json())
      .then((data) => {
        const familyTree = new FamilyTree();
        familyTree.buildFromFamilyData(data);
        setFamilyTree(familyTree);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching family tree data: ', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading && familyTree !== undefined) {
      setMemberNames(familyTree?.getAllMembersNames() ?? []);
    }
  }, [familyTree, loading]);

  useEffect(() => {
    if (
      selectedMember !== null &&
      selectedRelationship !== null &&
      familyTree !== null
    )
      setResolvedMembers(
        familyTree.getMembersByRelationship(
          selectedMember,
          selectedRelationship
        )
      );
  }, [selectedMember, selectedRelationship, familyTree]);

  return (
    <Container maxWidth='md'>
      <Typography sx={{ my: 1 }} textAlign='center' variant='h5'>
        King Chan Family Tree
      </Typography>
      <Box sx={{ mb: 1 }}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls='panel1a-content'
            id='panel1a-header'>
            <Typography>Family Tree Reference Image</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              component='img'
              width='100%'
              alt='Family Tree Ref Image'
              src={`${
                process.env.NODE_ENV === 'production'
                  ? process.env.REACT_APP_WEBSITE_URL
                  : './king-shan-family-tree'
              }/ftref.png`}
            />
          </AccordionDetails>
        </Accordion>
      </Box>
      {memberNames?.length > 0 && (
        <Card sx={{ mb: 1 }}>
          <CardContent>
            <Typography sx={{ mb: 2 }} variant='body1'>
              Get members by relationship (Problem 1)
            </Typography>
            <Autocomplete
              onInputChange={(event, newInputValue, reason) => {
                if (reason === 'reset') {
                  setSelectedRelationship(null);
                  return;
                }
              }}
              sx={{ my: 1 }}
              options={memberNames}
              onChange={(event: any, newValue: string | null) => {
                setSelectedRelationship(null);
                setSelectedMember(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} size='small' label='Select a member' />
              )}
            />
            <Collapse in={selectedMember !== null}>
              <Autocomplete
                sx={{ my: 1 }}
                value={selectedRelationship}
                options={RELATIONSHIPS}
                onChange={(event: any, newValue: string | null) => {
                  setSelectedRelationship(newValue as Relationship);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size='small'
                    label='Select a relationship'
                  />
                )}
              />
            </Collapse>
            <Collapse
              in={selectedMember !== null && selectedRelationship !== null}>
              <Typography variant='body1'>
                {`${selectedMember}'s ${selectedRelationship}`}
              </Typography>
              {resolvedMembers !== null && resolvedMembers.length > 0 ? (
                resolvedMembers.map((resolvedMember, index) => (
                  <ListItem key={index}>{resolvedMember.getName()}</ListItem>
                ))
              ) : (
                <Alert severity='warning' sx={{ mt: 1 }}>
                  <AlertTitle>No record in this family tree</AlertTitle>
                </Alert>
              )}
            </Collapse>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default FamilyTreePage;
