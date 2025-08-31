import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    Grid,
    Card,
    CardContent,
    Paper
} from '@mui/material';

// ✅ Use backend URL from environment variable
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || '/api';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}`);
            const data = response.data?.notes || response.data || [];
            setNotes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const addNote = async () => {
        if (!title.trim() || !content.trim()) return;
        try {
            const response = await axios.post(`${API_BASE_URL}`, { title, content });
            setNotes((prev) => [...prev, response.data]);
            setTitle('');
            setContent('');
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    return (
        <Paper
            sx={{
                backgroundColor: 'rgb(135,206,250)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 4,
            }}
        >
            <Container maxWidth="lg">
                <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                    {/* Add Note Form */}
                    <Box flex={1} minWidth="300px" mr={{ xs: 0, md: 4 }} mb={{ xs: 4, md: 0 }}>
                        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', marginBottom: 4 }}>
                            Add a New Note
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={(e) => { e.preventDefault(); addNote(); }}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                backgroundColor: 'white',
                                padding: 3,
                                borderRadius: 2,
                                boxShadow: 3,
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                variant="outlined"
                            />
                            <TextField
                                fullWidth
                                label="Content"
                                multiline
                                rows={4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                variant="outlined"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ alignSelf: 'center' }}
                            >
                                Add Note
                            </Button>
                        </Box>
                    </Box>

                    {/* Notes List */}
                    <Box flex={1} minWidth="300px">
                        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', marginBottom: 4 }}>
                            Notes List
                        </Typography>
                        <Grid container spacing={3}>
                            {notes.length === 0 ? (
                                <Typography variant="body1" sx={{ margin: '0 auto' }}>
                                    No notes yet.
                                </Typography>
                            ) : (
                                notes.map((note, idx) => (
                                    <Grid item xs={12} key={note.id || idx}>
                                        <Card elevation={3} sx={{ height: '100%' }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    {note.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {note.content}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Paper>
    );
};

export default Notes;
