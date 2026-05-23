import React, { useState } from 'react';
import { Container, CssBaseline, AppBar, Toolbar, Typography, Tabs, Tab, Box } from '@mui/material';
import AddCost from './pages/addCost';
import Reports from './pages/reports';
import Settings from './pages/settings';

// TabPanel component for hiding/showing tab content
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

// Main App component with tab-based navigation
function App() {
    // State to track active tab
    const [tabValue, setTabValue] = useState(0);

    // Handle tab selection changes
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Render app with header and tabbed interface
    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="static" sx={{ mb: 4 }}>
                <Toolbar>
                    <Typography variant="h6">Cost Manager</Typography>
                </Toolbar>
            </AppBar>
            <Container>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="navigation tabs">
                        <Tab label="Add Cost" id="tab-0" aria-controls="tabpanel-0" />
                        <Tab label="Reports" id="tab-1" aria-controls="tabpanel-1" />
                        <Tab label="Settings" id="tab-2" aria-controls="tabpanel-2" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <AddCost />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Reports />
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <Settings />
                </TabPanel>
            </Container>
        </React.Fragment>
    );
}

export default App;