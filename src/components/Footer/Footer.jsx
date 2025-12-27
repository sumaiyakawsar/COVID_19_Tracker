import React from 'react';
import {
    Typography,
    Box,
    IconButton,
    Fade,
    useTheme,
    useMediaQuery,
    Container,
    Stack,
    alpha,
    Divider
} from '@mui/material';
import {
    GitHub,
    DataObject,
    OpenInNew,
    Favorite,
    Code,
    Palette,
    TrendingUp,
    Link as LinkIcon,
    KeyboardArrowUp
} from '@mui/icons-material';
import styles from './Footer.module.css';
import { scrollToTop } from '../../hook/utils';

function Footer({ darkMode }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const colors = {
        background: 'transparent',
        textPrimary: darkMode ? '#ffffff' : '#0a0a1a',
        textSecondary: darkMode ? '#b0b0d0' : '#555577',
        accent: darkMode ? '#646cff' : '#0050cc',
        secondaryAccent: darkMode ? '#00d4aa' : '#008055'
    };

    const techItems = [
        {
            name: 'React',
            icon: <Code sx={{ fontSize: 20 }} />,
            color: '#61dafb',
            url: 'https://react.dev',
            description: 'JavaScript library for building user interfaces'
        },
        {
            name: 'MUI',
            icon: <Palette sx={{ fontSize: 20 }} />,
            color: '#007fff',
            url: 'https://mui.com/material-ui/getting-started/',
            description: 'React component library'
        },
        {
            name: 'Chart.js',
            icon: <TrendingUp sx={{ fontSize: 20 }} />,
            color: '#ff6384',
            url: 'https://react-chartjs-2.js.org/',
            description: 'React wrapper for Chart.js'
        }
    ];


    return (
        <>
            <IconButton
                onClick={scrollToTop}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1000,
                    background: darkMode
                        ? alpha('#646cff', 0.9)
                        : alpha('#0050cc', 0.9),  
                    color: '#fff',
                    width: 48,
                    height: 48,
                    '&:hover': {
                        background: darkMode
                            ? alpha('#646cff', 1)
                            : alpha('#0050cc', 1),  
                        transform: 'translateY(-4px)',
                        boxShadow: darkMode
                            ? `0 6px 20px ${alpha('#646cff', 0.4)}`
                            : `0 6px 20px ${alpha('#0050cc', 0.3)}`
                    },
                    transition: 'all 0.3s ease',
                    boxShadow: darkMode
                        ? `0 4px 12px ${alpha('#646cff', 0.3)}`
                        : `0 4px 12px ${alpha('#0050cc', 0.2)}`,
                    display: { xs: 'none', sm: 'flex' }
                }}
            >
                <KeyboardArrowUp sx={{ fontSize: 28 }} />
            </IconButton>

            <footer>
                <Container maxWidth="lg">
                    <Fade in={true} timeout={800}>
                        <Box sx={{
                            mt: 12,
                            mb: 6,
                            position: 'relative'
                        }}>
                          
                            {/* Subtle gradient line */}
                            <Box sx={{
                                height: '1px',
                                background: darkMode
                                    ? `linear-gradient(90deg, transparent 0%, ${alpha('#646cff', 0.3)} 50%, transparent 100%)`
                                    : `linear-gradient(90deg, transparent 0%, ${alpha('#0050cc', 0.2)} 50%, transparent 100%)`,  
                                mb: 6
                            }} />

                            {/* Main content area */}
                            <Stack
                                direction={{ xs: 'column', md: 'row' }}
                                alignItems="center"
                                justifyContent="space-between"
                                spacing={4}
                                sx={{ mb: 6 }}
                            >
                                {/* Left: Tech Stack */}
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: { xs: 'center', md: 'flex-start' }
                                }}>
                                    <Typography variant="caption" sx={{
                                        color: darkMode ? '#ffffffff' : '#555577',  
                                        fontWeight: 600, 
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        mb: 2,
                                        fontSize: '0.7rem',
                                        opacity: 0.9  
                                    }}>
                                        Built With
                                    </Typography>

                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        sx={{
                                            '& .tech-item': {
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    '& .tech-icon': {
                                                        background: darkMode
                                                            ? alpha('#646cff', 0.15)
                                                            : alpha('#0050cc', 0.1),  
                                                        borderColor: darkMode
                                                            ? alpha('#646cff', 0.3)
                                                            : alpha('#0050cc', 0.2)  
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        {techItems.map((tech) => (
                                            <Box
                                                key={tech.name}
                                                component="a"
                                                href={tech.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="tech-item"
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    textDecoration: 'none',
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    '&:hover .tech-tooltip': {
                                                        opacity: 1,
                                                        visibility: 'visible',
                                                        transform: 'translateY(0)'
                                                    }
                                                }}
                                            >
                                                {/* Tooltip */}
                                                <Box
                                                    className="tech-tooltip"
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: '100%',
                                                        mb: 1,
                                                        background: darkMode
                                                            ? '#1a1a2e' 
                                                            : '#ffffff',
                                                        color: darkMode ? '#ffffff' : '#0a0a1a', 
                                                        padding: '6px 10px',
                                                        borderRadius: '6px',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 500,
                                                        whiteSpace: 'nowrap',
                                                        boxShadow: darkMode
                                                            ? `0 4px 12px ${alpha('#000', 0.4)}`  
                                                            : `0 4px 12px ${alpha('#000', 0.15)}`,
                                                        border: `1px solid ${darkMode
                                                            ? alpha('#646cff', 0.2)
                                                            : alpha('#0050cc', 0.1)}`,  
                                                        opacity: 0,
                                                        visibility: 'hidden',
                                                        transform: 'translateY(10px)',
                                                        transition: 'all 0.2s ease',
                                                        zIndex: 1,
                                                        '&::after': {
                                                            content: '""',
                                                            position: 'absolute',
                                                            top: '100%',
                                                            left: '50%',
                                                            transform: 'translateX(-50%)',
                                                            borderWidth: '5px',
                                                            borderStyle: 'solid',
                                                            borderColor: `${darkMode ? '#1a1a2e' : '#ffffff'} transparent transparent transparent`
                                                        }
                                                    }}
                                                >
                                                    {tech.description}
                                                </Box>

                                                <Box
                                                    className="tech-icon"
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: '14px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: darkMode
                                                            ? alpha(tech.color, 0.1)
                                                            : alpha(tech.color, 0.08),
                                                        border: `1px solid ${darkMode
                                                            ? alpha(tech.color, 0.2)
                                                            : alpha(tech.color, 0.15)}`,
                                                        color: tech.color
                                                    }}
                                                >
                                                    {tech.icon}
                                                </Box>
                                                <Typography variant="caption" sx={{
                                                    color: darkMode ? '#ffffffff' : '#555577',  
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600, 
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}>
                                                    {tech.name}
                                                    <OpenInNew sx={{ fontSize: 10, color: 'inherit' }} />
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>

                                {/* Center: Data Source */}
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}>
                                    <Typography variant="caption" sx={{
                                        color: darkMode ? '#ffffffff' : '#555577',  
                                        fontWeight: 600,  
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        mb: 2,
                                        fontSize: '0.7rem',
                                        opacity: 0.9  
                                    }}>
                                        Powered By
                                    </Typography>

                                    <Box
                                        component="a"
                                        href="https://disease.sh"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            textDecoration: 'none',
                                            p: 2,
                                            borderRadius: '12px',
                                            transition: 'all 0.3s ease',
                                            background: darkMode
                                                ? alpha('#646cff', 0.08)
                                                : alpha('#0050cc', 0.06),  
                                            border: `1px solid ${darkMode
                                                ? alpha('#646cff', 0.15)
                                                : alpha('#0050cc', 0.1)}`,  
                                            '&:hover': {
                                                background: darkMode
                                                    ? alpha('#646cff', 0.12)
                                                    : alpha('#0050cc', 0.1),  
                                                borderColor: darkMode
                                                    ? alpha('#646cff', 0.3)
                                                    : alpha('#0050cc', 0.2),  
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        <DataObject sx={{
                                            color: darkMode ? '#646cff' : '#0050cc',  
                                            fontSize: 22
                                        }} />
                                        <Box>
                                            <Typography variant="subtitle2" sx={{
                                                color: darkMode ? '#ffffff' : '#0a0a1a',  
                                                fontWeight: 700,  
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                fontSize: '0.9rem'
                                            }}>
                                                disease.sh
                                                <OpenInNew sx={{ fontSize: 10, color: 'inherit' }} />
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Right: Developer */}
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: { xs: 'center', md: 'flex-end' }
                                }}>

                                    <Typography variant="caption" sx={{
                                        color: darkMode ? '#ffffffff' : '#555577',  
                                        fontWeight: 600,  
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        mb: 2,
                                        fontSize: '0.7rem',
                                        opacity: 0.9,  
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1,
                                        flexWrap: 'wrap'
                                    }}>
                                        <span>Made with</span>
                                        <Favorite
                                            className={styles.pulse}
                                            sx={{
                                                fontSize: 12,
                                                color: '#ff4081'
                                            }}
                                        />

                                    </Typography>
                                    <Box
                                        component="a"
                                        href="https://github.com/sumaiyakawsar"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            textDecoration: 'none',
                                            p: 2,
                                            borderRadius: '12px',
                                            transition: 'all 0.3s ease',
                                            background: darkMode
                                                ? alpha('#ff4081', 0.08)
                                                : alpha('#ff4081', 0.06),
                                            border: `1px solid ${darkMode
                                                ? alpha('#ff4081', 0.15)
                                                : alpha('#ff4081', 0.1)}`,
                                            '&:hover': {
                                                background: darkMode
                                                    ? alpha('#ff4081', 0.12)
                                                    : alpha('#ff4081', 0.1),
                                                borderColor: darkMode
                                                    ? alpha('#ff4081', 0.3)
                                                    : alpha('#ff4081', 0.2),
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        <GitHub sx={{
                                            color: '#ff4081',
                                            fontSize: 22
                                        }} />
                                        <Box>
                                            <Typography variant="subtitle2" sx={{
                                                color: darkMode ? '#ffffff' : '#0a0a1a',
                                                fontWeight: 700,
                                                fontSize: '0.9rem'
                                            }}>
                                                Sumaiya Kawsar
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Stack>


                        </Box>
                    </Fade>
                </Container>
            </footer>
        </>
    );
}

export default Footer;