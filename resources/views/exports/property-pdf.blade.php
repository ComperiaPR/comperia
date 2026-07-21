<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Property #{{ $property->id }}</title>
    <style>
        body { font-family: Helvetica, Arial, sans-serif; font-size: 11px; color: #1e293b; }
        .section-title { background: #2563eb; color: #ffffff; font-weight: bold; padding: 6px 10px; margin-top: 12px; }
        .section-title.light { background: #60a5fa; }
        table.fields { width: 100%; border-collapse: collapse; }
        table.fields td { padding: 4px 10px; vertical-align: top; width: 33.33%; }
        .label { font-weight: bold; color: #0f172a; display: block; }
        .value { color: #1e293b; }
        a { color: #2563eb; }
    </style>
</head>
<body>
    <div class="section-title">Property Number: {{ $property->id }}</div>
    <table class="fields">
        <tr>
            <td><span class="label">Property Type:</span><span class="value">{{ $property->property_type->name ?? '' }}</span></td>
            <td><span class="label">Type of Transaction:</span><span class="value">{{ $property->transaction_type->name ?? '' }}</span></td>
            <td><span class="label">Sale Date:</span><span class="value">{{ optional($property->sale_date)->format('Y-m-d') }}</span></td>
        </tr>
    </table>

    <div class="section-title light">Address</div>
    <table class="fields">
        <tr>
            <td><span class="label">Municipality:</span><span class="value">{{ $property->municipality->name ?? '' }}</span></td>
            <td><span class="label">Development:</span><span class="value">{{ $property->development }}</span></td>
            <td><span class="label">Street:</span><span class="value">{{ $property->street }}</span></td>
        </tr>
        <tr>
            <td><span class="label">Unit No:</span><span class="value">{{ $property->unit_number }}</span></td>
            <td><span class="label">Ward:</span><span class="value">{{ $property->ward }}</span></td>
            <td><span class="label">Sector:</span><span class="value">{{ $property->sector }}</span></td>
        </tr>
        <tr>
            <td><span class="label">Road/Km.:</span><span class="value">{{ $property->road_kilometer }}</span></td>
            <td><span class="label">Zip Code:</span><span class="value">{{ $property->zip_code }}</span></td>
            <td><span class="label">Tax ID:</span><span class="value">{{ $property->cadastre }}</span></td>
        </tr>
        <tr>
            <td><span class="label">Latitude:</span><span class="value">{{ $property->latitude }}</span></td>
            <td><span class="label">Longitude:</span><span class="value">{{ $property->longitude }}</span></td>
            <td>
                <span class="label">Google Maps:</span>
                <span class="value">
                    @if($property->latitude && $property->longitude)
                        <a href="https://maps.google.com/?q={{ $property->latitude }},{{ $property->longitude }}">View on map</a>
                    @endif
                </span>
            </td>
        </tr>
    </table>

    <table class="fields">
        <tr>
            <td><span class="label">Seller:</span><span class="value">{{ $property->seller }}</span></td>
            <td><span class="label">Resident of Seller:</span><span class="value">{{ $property->resident_seller }}</span></td>
            <td><span class="label">Buyer:</span><span class="value">{{ $property->buyer }}</span></td>
        </tr>
        <tr>
            <td><span class="label">Resident of Buyer:</span><span class="value">{{ $property->resident_buyer }}</span></td>
            <td><span class="label">Notary:</span><span class="value">{{ $property->notary }}</span></td>
            <td><span class="label">Deed No.:</span><span class="value">{{ $property->deed_no }}</span></td>
        </tr>
        <tr>
            <td><span class="label">Registry:</span><span class="value">{{ $property->registry }}</span></td>
            <td><span class="label">Track No.:</span><span class="value">{{ $property->track_no }}</span></td>
            <td><span class="label">Daily:</span><span class="value">{{ $property->daily }}</span></td>
        </tr>
        <tr>
            <td><span class="label">Page Entry:</span><span class="value">{{ $property->page_entry }}</span></td>
            <td><span class="label">Inscription:</span><span class="value">{{ $property->inscription }}</span></td>
            <td></td>
        </tr>
    </table>

    <div class="section-title light">
        Sale Price: {{ $property->price !== null ? '$' . number_format((float) $property->price, 2) : '' }}
    </div>
    <table class="fields">
        <tr>
            <td><span class="label">Price / Sq. Meter:</span><span class="value">{{ $property->price_sqr_meter !== null ? '$' . number_format((float) $property->price_sqr_meter, 2) : '' }}</span></td>
            <td><span class="label">Price / Sq. Feet:</span><span class="value">{{ $property->price_sqr_feet !== null ? '$' . number_format((float) $property->price_sqr_feet, 2) : '' }}</span></td>
            <td><span class="label">Price / Cuerda:</span><span class="value">{{ $property->price_cuerdas !== null ? '$' . number_format((float) $property->price_cuerdas, 2) : '' }}</span></td>
        </tr>
    </table>

    <div class="section-title light">Lot Area</div>
    <table class="fields">
        <tr>
            <td><span class="label">Sq. Meter:</span><span class="value">{{ $property->area_sqr_meter }}</span></td>
            <td><span class="label">Sq. Feet:</span><span class="value">{{ $property->area_sqr_feet }}</span></td>
            <td><span class="label">Cuerdas:</span><span class="value">{{ $property->area_cuerdas }}</span></td>
        </tr>
    </table>

    <table class="fields">
        <tr>
            <td><span class="label">GLA +/- SF:</span><span class="value">{{ $property->gla_sf }}</span></td>
            <td><span class="label">GBA +/- SF:</span><span class="value">{{ $property->gba_sf }}</span></td>
            <td><span class="label">Zoning:</span><span class="value">{{ $property->zoning }}</span></td>
        </tr>
        <tr>
            <td><span class="label">Flood Zone:</span><span class="value">{{ $property->flood_zone }}</span></td>
            <td><span class="label">Property Condition:</span><span class="value">{{ $property->property_condition->name ?? '' }}</span></td>
            <td></td>
        </tr>
        <tr>
            <td colspan="3"><span class="label">Property Past / Current Use:</span><span class="value">{{ $property->past_current_use }}</span></td>
        </tr>
        <tr>
            <td><span class="label">Mortgagee:</span><span class="value">{{ $property->mortgagee->name ?? '' }}</span></td>
            <td><span class="label">Mortgagee Amount:</span><span class="value">{{ $property->mortgagee_amount !== null ? '$' . number_format((float) $property->mortgagee_amount, 2) : '' }}</span></td>
            <td><span class="label">Interest Rate %:</span><span class="value">{{ $property->interest_rate }}</span></td>
        </tr>
        <tr>
            <td colspan="3"><span class="label">Remarks:</span><span class="value">{{ $property->remarks }}</span></td>
        </tr>
    </table>
</body>
</html>
