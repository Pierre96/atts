package com.atts.tools.msystem.domain.model.pageable;

import java.util.List;

public record SearchCriteria(String column, String equals, String contains, String startsWith, String endsWith,
                             String min, String max, Boolean isEmpty, List<String> anyOf) {

}
