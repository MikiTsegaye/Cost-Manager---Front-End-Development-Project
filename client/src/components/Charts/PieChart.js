import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PieChart = ({ data, currency }) => {
    // Reference to SVG container for D3 rendering
    const svgRef = useRef();

    // Generate and update chart whenever data or currency changes
    useEffect(() => {
        // Skip rendering if no data provided
        if (!data || data.length === 0) return;

        // Aggregate costs by category for pie chart
        const categoryTotals = {};
        data.forEach(item => {
            if (!categoryTotals[item.category]) {
                categoryTotals[item.category] = 0;
            }
            categoryTotals[item.category] += item.convertedSum;
        });

        // Convert to array format required by D3 pie generator
        const chartData = Object.entries(categoryTotals).map(([category, sum]) => ({
            category,
            sum: parseFloat(sum.toFixed(2))
        }));

        // Exit if no categories have data
        if (chartData.length === 0) return;

        // Set SVG dimensions for responsive layout
        const width = 400;
        const height = 300;
        const radius = Math.min(width, height) / 2 - 10;

        // Clear previous chart to prevent duplicates
        d3.select(svgRef.current).selectAll("*").remove();

        // Create SVG container and central group for pie
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        // Define color scheme for pie slices
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Create pie layout generator from data
        const pie = d3.pie().value(d => d.sum);

        // Create arc generator for slice paths
        const arc = d3.arc().innerRadius(0).outerRadius(radius);

        // Bind data to pie slices and create groups
        const arcs = svg.selectAll('.arc')
            .data(pie(chartData))
            .enter()
            .append('g')
            .attr('class', 'arc');

        // Draw colored paths for each slice
        arcs.append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => color(i))
            .attr('stroke', 'white')
            .attr('stroke-width', 2);

        // Add percentage labels on pie slices
        arcs.append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .attr('fill', 'white')
            .text(d => {
                // Calculate percentage of total for display
                const percentage = ((d.data.sum / d3.sum(chartData, d => d.sum)) * 100).toFixed(1);
                return `${percentage}%`;
            });

        // Create legend showing category names and amounts
        const legend = svg.selectAll('.legend')
            .data(chartData)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(${radius + 40},${-radius + i * 20})`);

        // Draw colored boxes for legend entries
        legend.append('rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', (d, i) => color(i));

        // Add category labels and amounts to legend
        legend.append('text')
            .attr('x', 18)
            .attr('y', 10)
            .attr('font-size', '12px')
            .text(d => `${d.category}: ${currency} ${d.sum.toFixed(2)}`);

    }, [data, currency]);

    // Render SVG container (D3 will populate via useEffect)
    return <svg ref={svgRef}></svg>;
};

export default PieChart;
