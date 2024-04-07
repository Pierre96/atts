package com.atts.tools.msystem.common.util;

import java.sql.Date;

public class DateUtil {

    public static Date minDate(Date date1, Date date2) {
        if (date1 == null) {
            return date2;
        }
        if (date2 == null) {
            return date1;
        }

        return date1.compareTo(date2) > 0 ? date2 : date1;

    }

    public static Date maxDate(Date date1, Date date2) {
        if (date1 == null) {
            return date2;
        }
        if (date2 == null) {
            return date1;
        }

        return date1.compareTo(date2) > 0 ? date1 : date2;
    }
}
