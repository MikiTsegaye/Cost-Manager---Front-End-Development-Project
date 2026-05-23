import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data, currency, year }) => {
    // Reference to SVG container for D3 rendering
    const svgRef = useRef();

    // Generate and update chart whenever data changes
    useEffect(() => {
        // Skip rendering if no data provided
        if (!data) return;

        // Month abbreviations for X-axis labels
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        // Convert data object to array with month labels
        const chartData = Array.from({ length: 12 }, (_, i) => ({
            month: monthNames[i],
            monthNumber: i + 1,
            sum: parseFloat((data[i + 1] || 0).toFixed(2))
        }));

        // Define SVG dimensions with margins for axes and labels
        const margin = { top: 20, right: 20, bottom: 30, left: 60 };
        const width = 500 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        // Clear previous chart elements to prevent duplication
        d3.select(svgRef.current).selectAll("*").remove();

        // Create SVG container with margins
        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create X-axis scale for months
        const xScale = d3.scaleBand()
            .domain(chartData.map(d => d.month))
            .range([0, width])
            .padding(0.1);

        // Create Y-axis scale with padding for better visualization
        const maxSum = d3.max(chartData, d => d.sum) || 1;
        const yScale = d3.scaleLinear()
            .domain([0, maxSum * 1.1])
            .range([height, 0]);

        // Define color gradient based on values
        const colorScale = d3.scaleLinear()
            .domain([0, maxSum])
            .range(['#E3F2FD', '#1976D2']);

        // Draw bars for each month with color based on value
        svg.selectAll('.bar')
            .data(chartData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.month))
            .attr('y', d => yScale(d.sum))
            .attr('width', xScale.bandwidth())
            .attr('height', d => height - yScale(d.sum))
            .attr('fill', d => colorScale(d.sum))
            .attr('stroke', '#1976D2')
            .attr('stroke-width', 1);

        // Add value labels on top of each bar
        svg.selectAll('.bar-label')
            .data(chartData)
            .enter()
            .append('text')
            .attr('class', 'bar-label')
            .attr('x', d => xScale(d.month) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.sum) - 5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px')
            .attr('fill', '#333')
            .text(d => d.sum > 0 ? `${currency} ${d.sum.toFixed(0)}` : '');

        // Draw X-axis with month labels
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .attr('font-size', '12px');

        // Draw Y-axis with value scale
        svg.append('g')
            .call(d3.axisLeft(yScale))
            .attr('font-size', '12px');

        // Add Y-axis label showing currency
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text(`Amount (${currency})`);

        // Add grid lines for easier value reading
        svg.append('g')
            .attr('class', 'grid')
            .attr('opacity', 0.1)
            .call(d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat('')
            );

    }, [data, currency, year]);

    // Render SVG container (D3 will populate via useEffect)
    return <svg ref={svgRef}></svg>;
};

export default BarChart;
