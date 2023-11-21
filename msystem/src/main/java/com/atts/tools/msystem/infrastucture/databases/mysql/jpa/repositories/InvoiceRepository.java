package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories;

import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

}
