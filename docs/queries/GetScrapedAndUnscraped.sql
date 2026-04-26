SELECT 
    COUNT(*) AS Total,
    SUM(CASE WHEN Validated = 'true' THEN 1 ELSE 0 END) AS Scraped,
    SUM(CASE WHEN Validated = 'false' THEN 1 ELSE 0 END) AS NotScraped
FROM potential_instruments;