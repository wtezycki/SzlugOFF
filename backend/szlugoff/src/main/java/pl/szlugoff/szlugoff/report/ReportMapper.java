package pl.szlugoff.szlugoff.report;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import pl.szlugoff.szlugoff.report.dto.ReportRequestDto;
import pl.szlugoff.szlugoff.report.dto.ReportResponseDto;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReportMapper {

    GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    // Request -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "status", constant = "NEW")
    @Mapping(target = "location", source = ".", qualifiedByName = "mapLocation")
    Report toEntity(ReportRequestDto request);

    // Entity -> Response
    @Mapping(target = "latitude", expression = "java(report.getLocation().getY())")
    @Mapping(target = "longitude", expression = "java(report.getLocation().getX())")
    @Mapping(target = "status", expression = "java(report.getStatus().getPolishName())")
    ReportResponseDto toDto(Report report);

    // Latitude / longitude mapping to Point
    @Named("mapLocation")
    default Point mapLocation(ReportRequestDto request) {
        return geometryFactory.createPoint(new Coordinate(request.longitude(), request.latitude()));
    }

    List<ReportResponseDto> toDtoList(List<Report> reports);
 }
