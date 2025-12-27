import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Chip,
    IconButton,
    useTheme,
    alpha,
    Container,
    useMediaQuery,
    Paper,
    TextField,
    InputAdornment,
    Avatar,
    Tooltip,
    ButtonGroup,
    Button,
    MenuItem,
    FormControl,
    Divider,
    Skeleton, Select
} from "@mui/material";
import {
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
    Coronavirus,
    Update,
    Search as SearchIcon,
    Public as PublicIcon,
    Flag as FlagIcon,
    ExpandMore as ExpandMoreIcon,
    Check as CheckIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    History as HistoryIcon,
    Sort as SortIcon,
    ArrowUpward,
    ArrowDownward
} from "@mui/icons-material";

import { fetchCountries } from '../../api';
import { useRecentCountries } from '../../hook/useRecentCountries';

const Header = ({ lastUpdate, darkMode, toggleDarkMode, selectedCountry, handleCountryChange }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
    const [selectedContinent, setSelectedContinent] = useState('all');
    const [favorites, setFavorites] = useState([]);
    const [continents, setContinents] = useState([]);
    const { recentlyViewed, addRecent } = useRecentCountries();

    useEffect(() => {
        const fetchAPI = async () => {
            try {
                setLoading(true);
                const countriesData = await fetchCountries();

                const uniqueContinents = [...new Set(countriesData
                    .filter(c => c.continent)
                    .map(c => c.continent)
                )];
                setContinents(uniqueContinents.sort());

                setCountries(countriesData);
                setFilteredCountries(sortCountries(countriesData, sortBy, sortDirection));

                const savedFavorites = JSON.parse(localStorage.getItem('countryFavorites')) || [];
                setFavorites(savedFavorites);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAPI();
    }, []);

    useEffect(() => {
        let result = [...countries];

        if (selectedContinent !== 'all') {
            result = result.filter(country =>
                country.continent === selectedContinent
            );
        }

        if (searchTerm.trim() !== '') {
            result = result.filter(country =>
                country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (country.continent && country.continent.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredCountries(sortCountries(result, sortBy, sortDirection));
    }, [searchTerm, countries, sortBy, sortDirection, selectedContinent]);

    const sortCountries = (data, sortType, direction) => {
        return [...data].sort((a, b) => {
            let comparison = 0;

            if (sortType === 'name') {
                comparison = a.country.localeCompare(b.country);
            } else if (sortType === 'cases') {
                const aCases = Number(a.cases) || 0;
                const bCases = Number(b.cases) || 0;
                comparison = bCases - aCases; // Default: descending for cases (most cases first)
            }

            // Apply direction
            return direction === 'desc' ? -comparison : comparison;
        });
    };

    const selectCountry = (country) => {
        handleCountryChange(country);
        addRecent(country);
        setOpen(false);
    };

    const handleChange = (event) => {
        selectCountry(event.target.value);
    };

    const toggleFavorite = (countryName, e) => {
        e.stopPropagation();
        let updatedFavorites;
        if (favorites.includes(countryName)) {
            updatedFavorites = favorites.filter(fav => fav !== countryName);
        } else {
            updatedFavorites = [...favorites, countryName];
        }
        setFavorites(updatedFavorites);
        localStorage.setItem('countryFavorites', JSON.stringify(updatedFavorites));
    };

    const handleContinentChange = (continent) => {
        setSelectedContinent(continent);
    };

    const handleSortChange = (newSort) => {
        if (newSort === sortBy) {
            // Toggle direction if clicking the same sort type
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new sort type with default direction
            setSortBy(newSort);
            // Set default direction based on sort type
            setSortDirection(newSort === 'name' ? 'asc' : 'desc');
        }
    };

    const handleClose = () => {
        setOpen(false);
        if (!selectedCountry) {
            setSearchTerm('');
        }
    };

    const getFavoriteCountries = () => {
        return countries.filter(country => favorites.includes(country.country));
    };

    const getRecentCountries = () => {
        return recentlyViewed
            .map(name => countries.find(c => c.country === name))
            .filter(Boolean);
    };

    const getSortIcon = () => {
        if (sortBy === 'name') {
            return sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
        } else if (sortBy === 'cases') {
            return sortDirection === 'desc' ? <ArrowDownward fontSize="small" /> : <ArrowUpward fontSize="small" />;
        }
        return <SortIcon fontSize="small" />;
    };


    if (loading) {
        return (
            <Box
                sx={{
                    py: { xs: 2, md: 4 },
                    my: 4,
                    position: "relative",
                    borderRadius: "20px",
                    overflow: "hidden",
                }}
            >
                <Container maxWidth="lg">
                    {/* Top Bar Skeleton */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 3, md: 4 } }}>
                        <Skeleton variant="rounded" width={200} height={50} sx={{ borderRadius: 3 }} />
                        <Skeleton variant="circular" width={44} height={44} />
                    </Box>

                    {/* Main Content Skeleton */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            gap: { xs: 3, md: 4 },
                            alignItems: { md: "center" },
                            justifyContent: "space-between",
                        }}
                    >
                        {/* Title Section */}
                        <Box sx={{ flex: 1, maxWidth: { md: "50%" } }}>
                            <Skeleton variant="text" width="80%" height={50} />
                            <Skeleton variant="text" width="60%" height={30} sx={{ mt: 1 }} />
                        </Box>

                        {/* Country Picker Section */}
                        <Box sx={{ flex: 1, maxWidth: { md: "50%" } }}>
                            <Skeleton variant="rounded" width="100%" height={52} />
                            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                                <Skeleton variant="rounded" width={50} height={32} />
                                <Skeleton variant="rounded" width={50} height={32} />
                                <Skeleton variant="rounded" width={50} height={32} />
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                py: { xs: 2, md: 4 },
                my: 4,
                position: "relative",
                borderRadius: "20px",
                overflow: "hidden",
                background: darkMode
                    ? `linear-gradient(135deg, ${alpha('#0f172a', 0.5)} 0%, ${alpha('#1e293b', 0.5)} 100%)`
                    : `linear-gradient(135deg, ${alpha('#667eea', 0.05)} 0%, ${alpha('#764ba2', 0.03)} 100%)`,

                backdropFilter: 'blur(20px)',
                borderBottom: `1px solid ${alpha(darkMode ? '#334155' : '#e2e8f0', 0.5)}`,
            }}
        >
            {/* Background decorative elements */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "100%",
                    background: darkMode
                        ? "radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)"
                        : "radial-gradient(circle at 10% 20%, rgba(102, 126, 234, 0.06) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(118, 75, 162, 0.04) 0%, transparent 50%)",
                    zIndex: 0,
                }}
            />

            <Container maxWidth="lg">

                {/* Top Navigation Bar */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: { xs: 3, md: 4 },
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    {/* Logo */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            padding: { xs: 1, sm: 1.5 },
                            borderRadius: 3,
                            background: alpha(darkMode ? '#1e293b' : '#ffffff', 0.8),
                            backdropFilter: "blur(20px)",
                            border: "1px solid",
                            borderColor: alpha(darkMode ? '#475569' : '#cbd5e1', 0.5),
                            boxShadow: `0 4px 24px ${alpha(darkMode ? '#000000' : '#cbd5e1', 0.1)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: `0 8px 32px ${alpha(darkMode ? '#000000' : '#cbd5e1', 0.15)}`,
                                borderColor: alpha(darkMode ? '#6366f1' : '#667eea', 0.3),
                            }
                        }}
                    >
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: "50%",
                                background: "rgba(255, 255, 255, 0.2)",
                                backdropFilter: "blur(10px)",
                                border: "2px solid rgba(255, 255, 255, 0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Coronavirus sx={{
                                fontSize: 28,
                                color: "#ff6b6b",
                                fontWeight: 700,
                            }} />
                        </Box>
                        <Box>
                            <Typography
                                variant={isMobile ? "body1" : "h6"}
                                sx={{
                                    fontWeight: 700,
                                    background: "linear-gradient(45deg, #ea6666ff 0%, #a24b4bff 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    letterSpacing: "-0.5px",
                                }}
                            >
                                COVID-19 TRACKER
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: alpha(darkMode ? '#ffffffff' : '#000000', 0.5),
                                display: 'block'
                            }}>
                                Dashboard
                            </Typography>
                        </Box>
                    </Box>

                    {/* Controls */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>

                        {/* Last Updated */}
                        <Box
                            sx={{
                                display: { xs: 'none', sm: 'flex' },
                                alignItems: "center",
                                gap: 1,
                                padding: "8px 16px",
                                borderRadius: 3,
                                background: alpha(darkMode ? '#1e293b' : '#ffffff', 0.5),
                                backdropFilter: "blur(10px)",
                                border: "1px solid",
                                borderColor: alpha(darkMode ? '#475569' : '#e2e8f0', 0.5),
                            }}
                            title="Date/Time"
                        >
                            <Update sx={{ fontSize: 16, color: darkMode ? '#94a3b8' : '#64748b' }} />

                            <Typography variant="caption"
                                sx={{
                                    fontWeight: 600,
                                    color: alpha(darkMode ? '#ffffffff' : '#000000', 0.5),

                                }}>
                                Updated: {new Date(lastUpdate).toLocaleString()}
                            </Typography>
                        </Box>

                        {/* Theme Toggle */}
                        <IconButton
                            onClick={toggleDarkMode}
                            sx={{
                                color: "white",
                                background: "#ffffff26",
                                width: 44,
                                height: 44,
                                backdropFilter: "blur(20px)",
                                border: "1px solid",
                                borderColor: alpha(darkMode ? '#475569' : '#e2e8f0', 0.5),
                                boxShadow: `0 4px 20px ${alpha(darkMode ? '#000000' : '#cbd5e1', 0.08)}`,
                                transition: "all 0.3s ease",
                                '&:hover': {
                                    boxShadow: `0 8px 25px ${alpha(darkMode ? '#000000' : '#cbd5e1', 0.12)}`,
                                    background: "rgba(255, 255, 255, 0.25)"
                                }
                            }}
                        >
                            {darkMode ?
                                <LightModeIcon sx={{ color: "#fbbf24", fontSize: 20 }} /> :
                                <DarkModeIcon sx={{ color: "#4b5563", fontSize: 20 }} />
                            }
                        </IconButton>
                    </Box>
                </Box>

                {/* Main Content Area */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: { xs: 3, md: 4 },
                        alignItems: { md: 'center' },
                        justifyContent: "space-between",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    {/* Title Section */}
                    <Box sx={{ flex: 1, maxWidth: { md: '50%' } }}>
                        <Typography
                            variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
                            sx={{
                                fontWeight: 800,
                                mb: 1,
                                background: darkMode
                                    ? "linear-gradient(45deg, #e2e8f0 0%, #94a3b8 50%, #cbd5e1 100%)"
                                    : "linear-gradient(45deg, #1e293b 0%, #334155 50%, #475569 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                letterSpacing: "-0.8px",
                                lineHeight: 1.2,
                            }}
                        >
                            Global Pandemic Statistics
                        </Typography>

                    </Box>

                    {/* Country Picker */}
                    <Box sx={{ flex: 1, maxWidth: { md: '50%' } }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5, px: 0.5 }}>

                            <Typography variant="caption" color="#ffffffff" fontWeight={600}>
                                {filteredCountries.length} regions
                            </Typography>
                        </Box>

                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: alpha(darkMode ? '#334155' : '#e2e8f0', 0.8),
                                backdropFilter: 'blur(20px)',
                                background: alpha(darkMode ? '#1e293b' : '#ffffff', 0.7),
                                boxShadow: `0 8px 32px ${alpha(darkMode ? '#000000' : '#cbd5e1', 0.1)}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: `0 12px 48px ${alpha(darkMode ? '#000000' : '#cbd5e1', 0.15)}`,
                                    borderColor: alpha('#667eea', 0.3),
                                }
                            }}
                        >
                            <FormControl fullWidth>
                                <Select
                                    value={selectedCountry || ""}
                                    onChange={handleChange}
                                    onClose={handleClose}
                                    onOpen={() => setOpen(true)}
                                    open={open}
                                    displayEmpty
                                    IconComponent={(props) => (
                                        <ExpandMoreIcon
                                            {...props}
                                            sx={{
                                                color: '#667eea',
                                                fontSize: 20,
                                                transition: 'transform 0.3s ease',
                                                transform: open ? 'rotate(180deg)' : 'none'
                                            }}
                                        />
                                    )}
                                    sx={{
                                        '& .MuiSelect-select': {
                                            py: 2,
                                            px: 2.5,
                                            display: 'flex',
                                            alignItems: 'center',
                                            minHeight: '52px',
                                            backgroundColor: 'transparent',

                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: 'none',
                                        }
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                borderRadius: 3,
                                                marginTop: 1,
                                                maxHeight: 400,
                                                backdropFilter: 'blur(20px)',
                                                background: alpha(darkMode ? '#1e293b' : '#ffffff', 0.98),
                                                boxShadow: `0 20px 60px ${alpha(darkMode ? '#000000' : '#cbd5e1', 0.2)}`,
                                                border: '1px solid',
                                                borderColor: alpha(darkMode ? '#334155' : '#e2e8f0', 0.5),
                                            }
                                        }
                                    }}
                                    renderValue={(value) => {
                                        if (!value) {
                                            return (
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Box
                                                        sx={{
                                                            p: 1.5,
                                                            borderRadius: '50%',
                                                            background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <PublicIcon sx={{ color: '#667eea', fontSize: 20 }} />
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="body1" fontWeight={500} sx={{
                                                            color: alpha(darkMode ? '#ffffffff' : '#000000', 0.5),
                                                        }}>
                                                            Global Overview
                                                        </Typography>
                                                        <Typography variant="caption" sx={{
                                                            color: alpha(darkMode ? '#ffffffff' : '#000000', 0.5),
                                                        }}>
                                                            Select a country to explore
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            );
                                        }
                                        const selected = countries.find((c) => c.country === value);
                                        return (
                                            <Box display="flex" alignItems="center" gap={2}>
                                                {selected?.countryInfo?.flag ? (
                                                    <Avatar
                                                        src={selected.countryInfo.flag}
                                                        alt={selected.country}
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            border: '2px solid',
                                                            borderColor: darkMode ? '#1e293b' : '#ffffff',
                                                        }}
                                                    />
                                                ) : (
                                                    <Avatar
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)'
                                                        }}
                                                    >
                                                        <FlagIcon sx={{ fontSize: 18, color: '#667eea' }} />
                                                    </Avatar>
                                                )}
                                                <Box>
                                                    <Typography variant="body1" fontWeight={500} sx={{
                                                        color: alpha(darkMode ? '#ffffffff' : '#000000', 0.5),
                                                    }}>
                                                        {selected?.country || value}
                                                    </Typography>
                                                    <Box display="flex" alignItems="center" gap={0.5}>
                                                        <Typography variant="caption" sx={{
                                                            color: alpha(darkMode ? '#ffffffff' : '#000000', 0.5),
                                                        }}>
                                                            {selected?.continent || 'Region'}
                                                        </Typography>
                                                        {selected?.cases && (
                                                            <>
                                                                <Typography variant="caption" sx={{
                                                                    color: alpha(darkMode ? '#ffffffff' : '#000000', 0.5),
                                                                }}>•</Typography>
                                                                <Typography variant="caption" color="#667eea" fontWeight={600}>
                                                                    {selected.cases.toLocaleString()}
                                                                </Typography>
                                                            </>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        );
                                    }}
                                >
                                    {/* Menu Content */}
                                    <Box sx={{ p: 2 }}>
                                        <TextField
                                            fullWidth
                                            placeholder="Search countries..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            size="small"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                                sx: {
                                                    borderRadius: 2,
                                                    backgroundColor: alpha(darkMode ? '#334155' : '#f8fafc', 0.5),
                                                    border: '1px solid',
                                                    color: alpha(darkMode ? '#ffffffff' : '#000000', 0.5),
                                                    borderColor: alpha(darkMode ? '#475569' : '#e2e8f0', 0.5),
                                                }
                                            }}
                                            sx={{ mb: 2 }}
                                        />

                                        {/* Sorting Controls */}
                                        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <ButtonGroup size="small" fullWidth>
                                                    <Button
                                                        type="button"
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSortChange('name'); }}
                                                        variant={sortBy === 'name' ? 'contained' : 'outlined'}
                                                        sx={{
                                                            borderRadius: '8px 0 0 8px',
                                                            backgroundColor: sortBy === 'name' ? alpha('#667eea', 0.1) : 'transparent',
                                                            color: sortBy === 'name' ? '#667eea' : 'inherit',
                                                            borderColor: alpha(darkMode ? '#475569' : '#e2e8f0', 0.5),
                                                        }}
                                                        endIcon={sortBy === 'name' ? getSortIcon() : null}
                                                    >
                                                        Name
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSortChange('cases'); }}
                                                        variant={sortBy === 'cases' ? 'contained' : 'outlined'}
                                                        sx={{
                                                            borderRadius: '0 8px 8px 0',
                                                            backgroundColor: sortBy === 'cases' ? alpha('#667eea', 0.1) : 'transparent',
                                                            color: sortBy === 'cases' ? '#667eea' : 'inherit',
                                                            borderColor: alpha(darkMode ? '#475569' : '#e2e8f0', 0.5),
                                                        }}
                                                        endIcon={sortBy === 'cases' ? getSortIcon() : null}
                                                    >
                                                        Cases
                                                    </Button>
                                                </ButtonGroup>
                                            </Box>
                                        </Box>

                                        {/* Continent Filter */}
                                        <Box display="flex" gap={0.5} flexWrap="wrap" sx={{
                                            mb: 2,
                                            color: alpha(darkMode ? '#ffffffff' : '#000000', 0.5),
                                        }}>
                                            <Chip
                                                label="All"
                                                size="small"
                                                onClick={(e) => { e.stopPropagation(); handleContinentChange('all'); }}
                                                sx={{
                                                    borderRadius: 2,
                                                    backgroundColor: selectedContinent === 'all' ? '#667eea' : alpha(darkMode ? '#334155' : '#f1f5f9', 1),
                                                    color: selectedContinent === 'all' ? 'white' : 'inherit',
                                                    '&:hover': {
                                                        backgroundColor: selectedContinent === 'all' ? '#667eea' : alpha(darkMode ? '#475569' : '#e2e8f0', 1)
                                                    }
                                                }}
                                            />
                                            {continents.map(continent => (
                                                <Chip
                                                    key={continent}
                                                    label={continent}
                                                    size="small"
                                                    onClick={(e) => { e.stopPropagation(); handleContinentChange(continent); }}

                                                    sx={{
                                                        borderRadius: 2,
                                                        backgroundColor: selectedContinent === continent ? '#667eea' : alpha(darkMode ? '#334155' : '#f1f5f9', 1),
                                                        color: selectedContinent === continent ? 'white' : 'inherit',
                                                        '&:hover': {
                                                            backgroundColor: selectedContinent === continent ? '#667eea' : alpha(darkMode ? '#475569' : '#e2e8f0', 1)
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Box>

                                        <Divider sx={{ my: 1 }} />

                                        {/* Global Option */}
                                        <MenuItem
                                            value=""
                                            onClick={() => selectCountry('')}
                                            sx={{
                                                borderRadius: 2,
                                                mb: 1,
                                                backgroundColor: selectedCountry === '' ? alpha('#667eea', 0.05) : 'transparent',
                                            }}
                                        >
                                            <Box display="flex" alignItems="center" gap={2} width="100%">
                                                <Avatar
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)'
                                                    }}
                                                >
                                                    <PublicIcon sx={{ fontSize: 18, color: '#667eea' }} />
                                                </Avatar>
                                                <Box flex={1}>
                                                    <Typography variant="body1" fontWeight={500} sx={{
                                                        color: alpha(darkMode ? '#ffffffff' : '#000000', 0.5),
                                                    }}>
                                                        Global Overview
                                                    </Typography>
                                                    <Typography variant="caption" sx={{
                                                        color: alpha(darkMode ? '#ffffffff' : '#000000', 0.5),
                                                    }}>
                                                        All regions worldwide
                                                    </Typography>
                                                </Box>
                                                {selectedCountry === '' && (
                                                    <CheckIcon sx={{ color: '#667eea', fontSize: 18 }} />
                                                )}
                                            </Box>
                                        </MenuItem>

                                        {/* Countries List */}
                                        <Box sx={{ maxHeight: 250, overflow: 'auto', mt: 1 }}>
                                            {filteredCountries.map((country) => (
                                                <MenuItem
                                                    key={country.country}
                                                    value={country.country}
                                                    onClick={() => selectCountry(country.country)}
                                                    sx={{
                                                        borderRadius: 2,
                                                        mb: 0.5,
                                                        backgroundColor: selectedCountry === country.country ? alpha('#667eea', 0.05) : 'transparent',
                                                    }}
                                                >
                                                    <Box display="flex" alignItems="center" gap={2} width="100%">
                                                        {country.countryInfo?.flag ? (
                                                            <Avatar
                                                                src={country.countryInfo.flag}
                                                                alt={country.country}
                                                                sx={{ width: 32, height: 32 }}
                                                            />
                                                        ) : (
                                                            <Avatar
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)'
                                                                }}
                                                            >
                                                                <FlagIcon sx={{ fontSize: 18, color: '#667eea' }} />
                                                            </Avatar>
                                                        )}
                                                        <Box flex={1}>
                                                            <Typography variant="body1" fontWeight={500} sx={{
                                                                color: alpha(darkMode ? '#ffffffff' : '#000000', 0.5),
                                                            }}>
                                                                {country.country}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{
                                                                color: alpha(darkMode ? '#ffffffff' : '#000000', 0.5),
                                                            }}>
                                                                {country.continent || 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            {country.cases && (
                                                                <Chip
                                                                    label={country.cases.toLocaleString()}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 20,
                                                                        fontSize: '0.7rem',
                                                                        backgroundColor: alpha('#667eea', 0.1),
                                                                        color: '#667eea'
                                                                    }}
                                                                />
                                                            )}
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => toggleFavorite(country.country, e)}
                                                                sx={{
                                                                    color: favorites.includes(country.country) ? '#ec4899' : 'action.disabled',
                                                                }}
                                                            >
                                                                {favorites.includes(country.country) ?
                                                                    <FavoriteIcon sx={{ fontSize: 16 }} /> :
                                                                    <FavoriteBorderIcon sx={{ fontSize: 16 }} />
                                                                }
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Box>
                                    </Box>
                                </Select>
                            </FormControl>
                        </Paper>

                        {/* Quick Access Countries */}
                        <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
                            {/* Global Reset */}
                            <Box display="flex" alignItems="center" gap={1}>
                                <Tooltip title="Global Overview">
                                    <Avatar
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            cursor: 'pointer',
                                            border: '2px solid',
                                            borderColor: darkMode ? '#1e293b' : '#ffffff',
                                            background: 'linear-gradient(135deg, #10b98133 0%, #34d39933 100%)',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                transform: 'scale(1.15)',
                                                boxShadow: '0 0 0 2px rgba(16,185,129,0.35)',
                                            }
                                        }}
                                        onClick={() => selectCountry('')}
                                    >
                                        <PublicIcon sx={{ fontSize: 16, color: '#10b981' }} />
                                    </Avatar>
                                </Tooltip>
                            </Box>

                            {favorites.length > 0 && (
                                <Box display="flex" alignItems="center" gap={1} sx={{ flex: 1 }}>
                                    <FavoriteIcon sx={{ fontSize: 14, color: '#ec4899' }} />
                                    <Typography variant="caption" sx={{
                                        color: alpha(darkMode ? '#ffffffff' : '#000000', 0.5),
                                    }}>
                                        Favorites:
                                    </Typography>
                                    <Box display="flex" alignItems="center">
                                        {getFavoriteCountries().slice(0, 5).map((country, index) => (
                                            <Tooltip key={country.country} title={country.country}>
                                                <Avatar
                                                    src={country.countryInfo?.flag}
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        cursor: 'pointer',
                                                        border: '2px solid',
                                                        borderColor: darkMode ? '#1e293b' : '#ffffff',
                                                        ml: index === 0 ? 0 : -0.8,
                                                        zIndex: 5 - index,
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.15)',
                                                            zIndex: 10,
                                                            boxShadow: '0 0 0 2px rgba(236,72,153,0.3)'
                                                        }
                                                    }}
                                                    onClick={() => selectCountry(country.country)}
                                                />
                                            </Tooltip>
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {recentlyViewed.length > 0 && (
                                <Box display="flex" alignItems="center" gap={1} sx={{ flex: 1 }}>
                                    <HistoryIcon sx={{ fontSize: 14, color: '#3b82f6' }} />
                                    <Typography variant="caption" sx={{
                                        color: alpha(darkMode ? '#ffffffff' : '#000000', 0.5),
                                    }}>
                                        Recent:
                                    </Typography>
                                    <Box display="flex" alignItems="center">
                                        {getRecentCountries().slice(0, 5).map((country, index) => (
                                            <Tooltip key={country.country} title={country.country}>
                                                <Avatar
                                                    src={country.countryInfo?.flag}
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        cursor: 'pointer',
                                                        border: '2px solid',
                                                        borderColor: darkMode ? '#1e293b' : '#ffffff',
                                                        ml: index === 0 ? 0 : -0.8,
                                                        zIndex: 5 - index,
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.1)',
                                                            zIndex: 10,
                                                        }
                                                    }}
                                                    onClick={() => selectCountry(country.country)}
                                                />
                                            </Tooltip>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Header;