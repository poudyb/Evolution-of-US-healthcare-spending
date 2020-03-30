### Selected focus / question:
given the current pandemic and discussions around healthcare spending, resources, and the political debates around single-payer option expansion, we were curious to dig into health insurance spending trends a bit more. We all know that healthcare spending has increased in the US, but we were curious to understand what that looked like on a state-by-state basis, and whether there were states that had done a better job controlling costs or become particular hotspots for spending. This was our primary question, with a second lens being whether those increases were coming from / shifting across particular spending categories.

### Visualization design choices: 
in order to show the relative per capita spend on a state-by-state basis, we decided to use a heatmap and slider bar, to enable the readers to quickly identify macro-trends. Instead of a continuous color legend, we decided to bucket the spending groups, thinking that this would make it easier to understand quickly and lessen the effect of side-by-side color perception distortion. In the first version, the state labels included the full state names; however, we found that this resulted in a busy visualization that took away from the heatmap information and made the northeast states very difficult to read (with overlapping text). Thus, we moved to state abbreviations, which we had to pull from a different data set and merge into the raw data. We originally planned to have the time-based evolution show through a “Play” / “Pause” button, but found that given the quantity of data (5 years) this led to a less favorable user experience (particularly with the variable accuracy of the “pause” functionality); as such, we switched to a step-based slider that shows the year along the slider and selected year on the left. We also originally had the year slider as a continuous bar slider, but felt it was important to make it step-based since year is not really a continuous variable, and we did not want to mislead readers into thinking that we had more-granular (e.g., monthly) data. 

We also wanted readers to be able to learn more about a specific state - either based on personal interest or heatmap findings - so we created both a tooltip to show all the state-specific data for that year in text form, which enables the user to quickly investigate different states by mousing over them, and a bar chart that activates on a click to display the same information visually, with a visual comparison to national averages for each category. We felt this dual encoding was important, both to communicate the information in different formats (text and a chart) and with different levels of engagement - mousing over is a lesser form of engagement, with someone more likely to take a “quick” look at several states, whereas clicking enables them to understand the information visually and compare it directly to the national average. 

For the tooltip, we originally showed only total spending data, with no additional formatting for the numbers or text; part of the rationale was to keep the tooltip small and brief. However, we felt that we should communicate more information in this first-level double-click, and spent time re-working the formatting of the numbers (with dollar signs, thousand-separator commas, and importantly, removal of decimal places that seem to indicate excessive accuracy) and the text (with bolding, underlining, and separation, plus the total number at the bottom to visually indicate the summation function). We found that these changes enabled a significant increase in clarity of the tooltip information and usability.

To complement the bar chart visualization, we felt it was important to include 1) instructions for the user in a sub-heading for the chart (ie, “Click on state to see its spend data here”); 2) a change in color when first engaged to show that the data displayed had updated (hence the bars turning blue to show this engagement); 3) maintenance of black bars with national averages so that the information from the “default” display of national data wasn’t lost; and 4) an explanation of the visual elements along with the data source, transformations, and inclusions/exclusions. Given our discussion of white-hat / black-hat visualizations, we felt this information - along with further references and links to the detailed methodology and raw data set - was important to include in a relatively-prominent way (e.g., not in very small text across the bottom). However, we wanted to maintain the effect of trustworthiness and full information without overwhelming the reader or including every definition and detail about the methodology; as such, we elected to defer most of the details to the source of the information, and instead include links to the full explanation of the methodology as well as the raw data set for users interested in learning more.

Finally, when it came to performance, we found that our map often re-loaded slowly when the year was changed (with significant variation across the team’s computers), making understanding the heatmap changes by year more difficult. We determined that this was because our code was re-drawing the map every time the selected year changed, with the new data; we thus modified the code to draw the map once and modify only the fill colors for each new year selection, making the interaction with the slider bar smoother, more efficient, and more enjoyable.

### Development process: 
We started by focusing on the creation of the heatmap for one year, then the creation of the slider, followed by the interaction between these two elements (re-drawing of the heat map based on slider input), and then focused on the other elements of interactivity - specifically, the encoding of the detailed information via tooltip and the bar-chart, with the formatting of these elements, text, labeling, and data source, etc. coming last. Bidusha led the heatmap creation, updating, and element interaction, while Zoe focused on the slider, tooltip, formatting, and text, and Devin owned the bar-chart visualization and dynamic sizing of the window and different containers. However, all team members collaborated and worked on each of these parts with each other. In fact, one of the most difficult parts of the process was in the duplication of effort as multiple team members tried to solve the same problem independently to be able to unlock the next part of the process; additionally, not all team members had experience with Git so version control and management during parallel work was difficult. But the team managed through it and was able to learn a lot from each other, as well as understand different ways to approach a single problem! In terms of people-hours, we likely spent ~60-70 hours on the project among the three of us; the two pieces that likely took the most time were the updating of the heatmap and interactivity between the different src files, and the dynamic sizing / location of different elements and containers on the page. 