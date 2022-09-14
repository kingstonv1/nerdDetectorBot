class timer_ 
{
    seconds = 0;
    minutes = 0;
    hours = 0;
    days = 0;

    increment() 
    {
        if (seconds < 59) 
            { seconds++; }
        else 
        {
            seconds = 0;
            
            if (minutes < 59)  
                { minutes++; }
            else 
            {
                minutes = 0;
                
                if (hours < 23) 
                    { hours++; }
                else 
                {
                    hours = 0;
                    days++;
                }
            }
        }

        return `\r\x1b[kUptime: ${days}d, ${hours}h, ${minutes}m, ${seconds}s`;
    }
};