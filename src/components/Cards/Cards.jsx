import React from 'react';
import Grid from '@mui/material/Grid';

import {
    CardContent,
    Typography,
    Box,
    alpha,
    useTheme,
    Fade,
    useMediaQuery,
    Skeleton
} from '@mui/material';
import CountUp from 'react-countup';
import {
    Coronavirus,
    LocalHospital,
    Favorite,
    SentimentVeryDissatisfied
} from '@mui/icons-material';

const Cards = ({ data: { confirmed, recovered, deaths, lastUpdate }, darkMode, loading }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    if (!confirmed || !recovered || !deaths || !lastUpdate) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <Box sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    borderTopColor: theme.palette.primary.main,
                    animation: 'spin 1.2s ease-in-out infinite',
                    '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                    }
                }} />
            </Box>
        );
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
                {[1, 2, 3, 4].map((item) => (
                    <Skeleton
                        key={item}
                        variant="rectangular"
                        width={275}
                        height={150}
                        sx={{ borderRadius: 2 }}
                    />
                ))}
            </Box>
        );
    }

    const confirmedValue = confirmed?.value ?? 0;
    const recoveredValue = recovered?.value ?? 0;
    const deathsValue = deaths?.value ?? 0;
    const activeCases = confirmedValue - recoveredValue - deathsValue;
    const recoveryRate = ((recoveredValue / confirmedValue) * 100).toFixed(1);
    const fatalityRate = ((deathsValue / confirmedValue) * 100).toFixed(1);
 
    const getCardStyles = (cardColor, isDarkMode) => {
        if (isDarkMode) {
            return {
                gradient: `linear-gradient(135deg, ${alpha(cardColor, 0.8)} 0%, ${alpha(cardColor, 0.4)} 100%)`,
                color: cardColor,
                backgroundColor: alpha('#1a1a1a', 0.8),
                borderColor: alpha(cardColor, 0.2),
                iconBackground: alpha(cardColor, 0.15),
                iconBorder: alpha(cardColor, 0.3),
                progressBackground: alpha('#ffffff', 0.1),
                glowColor: alpha(cardColor, 0.3),
                titleColor: '#ffffff',
                descriptionColor: alpha('#ffffff', 0.7),
                gradientTextFrom: '#ffffff',
                gradientTextTo: '#e0e0e0'
            };
        } else {
            return {
                gradient: `linear-gradient(135deg, ${cardColor} 0%, ${alpha(cardColor, 0.7)} 100%)`,
                color: cardColor,
                backgroundColor: alpha('#ffffff', 0.08),
                borderColor: alpha('#ffffff', 0.15),
                iconBackground: alpha('#ffffff', 0.15),
                iconBorder: alpha('#ffffff', 0.2),
                progressBackground: alpha('#ffffff', 0.1),
                glowColor: alpha(cardColor, 0.3),
                titleColor: '#ffffff',
                descriptionColor: alpha('#ffffff', 0.7),
                gradientTextFrom: '#ffffff',
                gradientTextTo: '#e0e0ff'
            };
        }
    };

    const cards = [
        {
            title: 'Total Cases',
            value: confirmedValue,
            icon: <Coronavirus />,
            baseColor: '#667eea',
            lightGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            description: 'Cumulative confirmed cases',
            maxWidth: 300,
            progress: Math.min(confirmedValue / 1000000 * 100, 100),
        },
        {
            title: 'Active Cases',
            value: activeCases,
            icon: <LocalHospital />,
            baseColor: '#f5576c',
            lightGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            description: 'Currently infected patients',
            maxWidth: 300,
            progress: Math.min(activeCases / 100000 * 100, 100),
        },
        {
            title: 'Recovered',
            value: recoveredValue,
            icon: <Favorite />,
            baseColor: '#00f2fe',
            lightGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            description: `Recovery rate: ${recoveryRate}%`,
            maxWidth: 300,
            progress: parseFloat(recoveryRate),
        },
        {
            title: 'Fatalities',
            value: deathsValue,
            icon: <SentimentVeryDissatisfied />,
            baseColor: '#a1c4fd',
            lightGradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
            description: `Fatality rate: ${fatalityRate} %`,
            maxWidth: 300,
            progress: parseFloat(fatalityRate),
        }
    ];

     const containerBackground = darkMode
        ? 'radial-gradient(circle at 10% 20%, rgba(120, 119, 198, 0.15) 0%, rgba(0, 0, 0, 0) 50%), radial-gradient(circle at 90% 80%, rgba(255, 119, 198, 0.15) 0%, rgba(0, 0, 0, 0) 50%)'
        : 'radial-gradient(circle at 10% 20%, rgba(120, 119, 198, 0.1) 0%, rgba(0, 0, 0, 0) 50%), radial-gradient(circle at 90% 80%, rgba(255, 119, 198, 0.1) 0%, rgba(0, 0, 0, 0) 50%)';

    const overlayBackground = darkMode
        ? 'linear-gradient(45deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
        : 'linear-gradient(45deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)';

    const radialGradient1 = darkMode
        ? 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, rgba(102, 126, 234, 0) 70%)'
        : 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, rgba(102, 126, 234, 0) 70%)';

    const radialGradient2 = darkMode
        ? 'radial-gradient(circle, rgba(79, 172, 254, 0.12) 0%, rgba(79, 172, 254, 0) 70%)'
        : 'radial-gradient(circle, rgba(79, 172, 254, 0.08) 0%, rgba(79, 172, 254, 0) 70%)';

    return (
        <Box sx={{
            p: { xs: 2, sm: 3, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '24px',
            background: containerBackground,
            backdropFilter: 'blur(12px)',
            backgroundColor: darkMode ? alpha('#121212', 0.7) : 'transparent',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: overlayBackground,
                pointerEvents: 'none'
            }
        }}>
            {/* Animated background elements */}
            <Box sx={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: radialGradient1,
                filter: 'blur(40px)',
                animation: 'float 20s ease-in-out infinite',
                '@keyframes float': {
                    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                    '50%': { transform: 'translate(-20px, 20px) scale(1.1)' }
                }
            }} />

            <Box sx={{
                position: 'absolute',
                bottom: '15%',
                right: '10%',
                width: 250,
                height: 250,
                borderRadius: '50%',
                background: radialGradient2,
                filter: 'blur(40px)',
                animation: 'float2 25s ease-in-out infinite',
                '@keyframes float2': {
                    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                    '50%': { transform: 'translate(20px, -20px) scale(0.9)' }
                }
            }} />

            <Box sx={{
                position: 'relative',
                zIndex: 1,
                maxWidth: 1400,
                mx: 'auto',
                borderRadius: '24px',
                animation: 'fadeIn 0.8s ease-out',
                '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                }
            }}>

                {/* Main Cards Grid */}
                <Fade in={true} timeout={1000}>
                    <Grid
                        container
                        spacing={3}
                        justifyContent="center"
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap'
                        }}
                    >
                        {cards.map((card, index) => {
                            const styles = getCardStyles(card.baseColor, darkMode);

                            return (
                                <Grid
                                    key={index}
                                    size={{ xs: 12, sm: 6, md: 6, lg: 3 }}                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '100%',
                                            maxWidth: card.maxWidth,
                                            minWidth: isMobile ? '100%' : 280,
                                            flex: '1 1 auto',
                                            background: styles.backgroundColor,
                                            backdropFilter: 'blur(20px)',
                                            border: `1px solid ${styles.borderColor}`,
                                            borderRadius: '24px',
                                            boxShadow: darkMode
                                                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                                                : '0 8px 32px rgba(0, 0, 0, 0.1)',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            '&:hover': {
                                                transform: 'translateY(-8px) scale(1.02)',
                                                boxShadow: `0 20px 40px ${styles.glowColor}`,
                                                '& .card-glow': {
                                                    opacity: 1
                                                }
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '6px',
                                                background: darkMode ? styles.gradient : card.lightGradient,
                                                borderRadius: '24px 24px 0 0'
                                            }
                                        }}
                                    >
                                        
                                        <Box className="card-glow" sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '100%',
                                            background: `radial-gradient(circle at 50% 0%, ${styles.glowColor} 0%, transparent 70%)`,
                                            opacity: 0,
                                            transition: 'opacity 0.4s ease',
                                            pointerEvents: 'none'
                                        }} />

                                        <CardContent
                                            sx={{
                                                p: { xs: 3, sm: 4 },
                                                position: 'relative',
                                                zIndex: 1,
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            {/* Card Header */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                mb: 3,
                                                flexShrink: 0
                                            }}>
                                                <Box sx={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                    mr: 2
                                                }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 600,
                                                            mb: 0.5,
                                                            color: styles.titleColor,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {card.title}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            opacity: 0.7,
                                                            display: 'block',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            color: styles.descriptionColor
                                                        }}
                                                    >
                                                        {card.description}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{
                                                    width: 56,
                                                    height: 56,
                                                    minWidth: 56,
                                                    borderRadius: '16px',
                                                    background: styles.iconBackground,
                                                    backdropFilter: 'blur(10px)',
                                                    border: `1px solid ${styles.iconBorder}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.3s ease',
                                                    flexShrink: 0
                                                }}>
                                                    {React.cloneElement(card.icon, {
                                                        sx: {
                                                            fontSize: 28,
                                                            color: styles.color
                                                        }
                                                    })}
                                                </Box>
                                            </Box>

                                            {/* Value Display */}
                                            <Box sx={{
                                                flex: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                my: 2
                                            }}>
                                                <Typography
                                                    variant={isMobile ? "h4" : "h4"}
                                                    fontWeight={800}
                                                    sx={{
                                                        textAlign: 'center',
                                                        mb: 1,
                                                        background: `linear-gradient(45deg, ${styles.gradientTextFrom} 30%, ${styles.gradientTextTo} 90%)`,
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                        lineHeight: 1.2,
                                                        wordBreak: 'break-word',
                                                        overflowWrap: 'break-word',
                                                        width: '100%'
                                                    }}
                                                >
                                                    <CountUp
                                                        start={0}
                                                        end={card.value}
                                                        duration={2.5}
                                                        separator=","
                                                        delay={index * 0.1}
                                                    />
                                                </Typography>
                                            </Box>

                                            {/* Progress Bar */}
                                            <Box sx={{
                                                height: 6,
                                                background: styles.progressBackground,
                                                borderRadius: 3,
                                                overflow: 'hidden',
                                                mb: 2,
                                                flexShrink: 0
                                            }}>
                                                <Box sx={{
                                                    width: `${card.progress}%`,
                                                    height: '100%',
                                                    background: darkMode ? styles.gradient : card.lightGradient,
                                                    borderRadius: 3,
                                                    transition: 'width 1.5s ease-out'
                                                }} />
                                            </Box>
                                        </CardContent>
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Fade>
            </Box>
        </Box>
    );
};

export default Cards;